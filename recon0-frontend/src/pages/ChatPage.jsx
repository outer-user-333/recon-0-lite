import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseChatClient'; // Note: using the specific chat client
import { getProfile } from '../lib/apiService';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);

    // Fetch the current user's profile to get their username
    useEffect(() => {
        getProfile().then(result => {
            if (result.success) {
                setUserProfile(result.data);
            }
        }).catch(err => setError(err.message));
    }, []);

    // Fetch initial messages and set up real-time subscription
    useEffect(() => {
        const fetchInitialMessages = async () => {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) setError(error.message);
            else setMessages(data);
        };

        fetchInitialMessages();

        const channel = supabase
            .channel('public:chat_messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, payload => {
                setMessages(currentMessages => [...currentMessages, payload.new]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Scroll to the bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !userProfile) return;

        const messageToSend = {
            sender_username: userProfile.username,
            content: newMessage.trim(),
        };

        const { error } = await supabase.from('chat_messages').insert(messageToSend);
        if (error) setError(error.message);
        else setNewMessage(''); // Clear input box on success
    };

    return (
        <div>
            <h2 className="mb-4">Safe Harbor Chat</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="card shadow-sm">
                <div className="card-body chat-box" style={{ height: '60vh', overflowY: 'auto' }}>
                    {messages.map(msg => (
                        <div key={msg.id} className={`mb-2 ${msg.sender_username === userProfile?.username ? 'text-end' : ''}`}>
                            <div className={`d-inline-block p-2 rounded ${msg.sender_username === userProfile?.username ? 'bg-primary text-white' : 'bg-light'}`}>
                                <strong>{msg.sender_username}:</strong> {msg.content}
                            </div>
                            <div className="text-muted small">
                                {new Date(msg.created_at).toLocaleTimeString()}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="card-footer">
                    <form onSubmit={handleSendMessage} className="d-flex">
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={!userProfile}
                        />
                        <button type="submit" className="btn btn-primary" disabled={!userProfile}>Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;