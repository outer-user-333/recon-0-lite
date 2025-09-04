import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // 1. Fetch initial chat history
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('chat_messages')
                .select(`
                    id,
                    content,
                    created_at,
                    sender_id,
                    profile:profiles ( username )
                `)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching messages:', error);
                setError('Could not fetch chat history.');
            } else {
                setMessages(data);
            }
        };

        // 2. Fetch current user's profile
        const fetchUserProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('id, username').eq('id', user.id).single();
                setUserProfile(profile);
            }
        };

        fetchUserProfile();
        fetchMessages();

        // 3. Subscribe to real-time updates
        const channel = supabase.channel('public:chat_messages')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chat_messages' },
                (payload) => {
                    // When a new message comes in, we need to get the sender's username
                    const fetchNewMessageProfile = async () => {
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('username')
                            .eq('id', payload.new.sender_id)
                            .single();
                        
                        const messageWithProfile = { ...payload.new, profile };
                        setMessages(currentMessages => [...currentMessages, messageWithProfile]);
                    };
                    fetchNewMessageProfile();
                }
            )
            .subscribe();

        // 4. Cleanup subscription on component unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Effect to scroll to the bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !userProfile) return;

        const { error } = await supabase
            .from('chat_messages')
            .insert({
                content: newMessage,
                sender_id: userProfile.id
            });

        if (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message.');
        } else {
            setNewMessage(''); // Clear input only on successful send
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Safe Harbor Chat</h2>
            <p className="text-muted mb-4">A real-time global chat room for the community.</p>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card shadow-lg" style={{ height: '70vh' }}>
                <div className="card-body d-flex flex-column" style={{ overflowY: 'auto' }}>
                    <div className="flex-grow-1">
                        {messages.map((msg) => (
                            <div key={msg.id} className="mb-3 d-flex">
                                <div className="avatar me-3 bg-secondary text-white">
                                    {msg.profile?.username.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div className="w-100">
                                    <div className="d-flex justify-content-between">
                                        <span className="fw-bold">{msg.profile?.username || 'User'}</span>
                                        <small className="text-muted">{new Date(msg.created_at).toLocaleTimeString()}</small>
                                    </div>
                                    <p className="mb-0 bg-light p-2 rounded">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                <div className="card-footer">
                    <form onSubmit={handleSendMessage}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={!userProfile}
                            />
                            <button className="btn btn-primary" type="submit" disabled={!userProfile}>
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;

