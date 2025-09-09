import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabaseChatClient.js'; 
import { getProfile } from '../lib/apiService.js';
import { Send, MessageSquare, Wifi, WifiOff } from 'lucide-react';

// Updated utility to provide both a background and a text color for each user
const userColorStyles = [
    { bg: 'bg-red-100', text: 'text-red-600' },
    { bg: 'bg-green-100', text: 'text-green-600' },
    { bg: 'bg-sky-100', text: 'text-sky-600' },
    { bg: 'bg-indigo-100', text: 'text-indigo-600' },
    { bg: 'bg-pink-100', text: 'text-pink-600' },
    { bg: 'bg-amber-100', text: 'text-amber-600' }
];

const getUserColorStyles = (username) => {
    let hash = 0;
    if (!username) return userColorStyles[0];
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % userColorStyles.length);
    return userColorStyles[index];
};

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const [error, setError] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');
    const [lastMessageTime, setLastMessageTime] = useState(null);
    const messagesEndRef = useRef(null);
    const channelRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const result = await getProfile();
                if (result.success) {
                    setUserProfile(result.data);
                    console.log('User profile loaded:', result.data);
                } else {
                    throw new Error(result.message || "Could not fetch user profile.");
                }
            } catch (err) {
                setError(err.message);
                console.error('Profile fetch error:', err);
            }
        };
        fetchProfile();
    }, []);

    // Handle new message from subscription
    const handleNewMessage = useCallback((payload) => {
        console.log('📨 New message received via subscription:', payload);
        const newMsg = payload.new;
        
        setMessages(currentMessages => {
            // Check if message already exists
            const exists = currentMessages.find(msg => msg.id === newMsg.id);
            if (exists) {
                console.log('⚠️ Duplicate message prevented:', newMsg.id);
                return currentMessages;
            }
            
            console.log('✅ Adding new message to state:', newMsg);
            setLastMessageTime(new Date().toISOString());
            return [...currentMessages, newMsg];
        });
    }, []);

    // Setup subscription with retry logic
    const setupSubscription = useCallback(() => {
        if (channelRef.current) {
            console.log('🔄 Removing existing channel...');
            supabase.removeChannel(channelRef.current);
        }

        console.log('🔌 Setting up new subscription...');
        setConnectionStatus('CONNECTING');

        channelRef.current = supabase
            .channel(`chat-${Math.random().toString(36).substr(2, 9)}`) // Unique channel name
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages'
                },
                (payload) => {
                    console.log('🔔 Raw payload received:', payload);
                    handleNewMessage(payload);
                }
            )
            .subscribe((status, err) => {
                console.log('📡 Subscription status changed:', status, err);
                setConnectionStatus(status);
                
                if (status === 'SUBSCRIBED') {
                    console.log('✅ Successfully subscribed to real-time updates');
                    setError('');
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('❌ Channel error:', err);
                    setError('Real-time connection failed. Retrying...');
                    // Retry after 3 seconds
                    reconnectTimeoutRef.current = setTimeout(() => {
                        setupSubscription();
                    }, 3000);
                } else if (status === 'TIMED_OUT') {
                    console.error('⏰ Subscription timed out');
                    setError('Connection timed out. Retrying...');
                    reconnectTimeoutRef.current = setTimeout(() => {
                        setupSubscription();
                    }, 2000);
                }
            });
    }, [handleNewMessage]);

    // Fetch initial messages
    const fetchMessages = useCallback(async () => {
        try {
            console.log('📥 Fetching initial messages...');
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                console.error('❌ Error fetching messages:', error);
                setError(`Failed to load messages: ${error.message}`);
            } else {
                console.log('📨 Initial messages loaded:', data?.length || 0);
                setMessages(data || []);
            }
        } catch (err) {
            console.error('❌ Exception fetching messages:', err);
            setError(err.message);
        }
    }, []);

    // Initialize chat (fetch messages + setup subscription)
    useEffect(() => {
        let mounted = true;

        const initializeChat = async () => {
            if (!mounted) return;
            
            await fetchMessages();
            if (mounted) {
                setupSubscription();
            }
        };

        initializeChat();

        // Cleanup
        return () => {
            mounted = false;
            if (channelRef.current) {
                console.log('🧹 Cleaning up subscription...');
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [fetchMessages, setupSubscription]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Handle sending message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !userProfile) return;

        try {
            console.log('📤 Sending message...');
            const messageToSend = {
                sender_username: userProfile.username,
                content: newMessage.trim(),
            };

            const { data, error } = await supabase
                .from('chat_messages')
                .insert(messageToSend)
                .select(); // This helps ensure we get the inserted data back

            if (error) {
                console.error('❌ Error sending message:', error);
                setError(`Failed to send message: ${error.message}`);
            } else {
                console.log('✅ Message sent successfully:', data);
                setNewMessage('');
                setError('');
            }
        } catch (err) {
            console.error('❌ Exception sending message:', err);
            setError(err.message);
        }
    };

    // Manual refresh function for debugging
    const handleManualRefresh = () => {
        console.log('🔄 Manual refresh triggered');
        fetchMessages();
    };

    // Connection status indicator
    const getStatusColor = () => {
        switch (connectionStatus) {
            case 'SUBSCRIBED': return 'text-green-600';
            case 'CONNECTING': return 'text-yellow-600';
            case 'CHANNEL_ERROR':
            case 'TIMED_OUT': return 'text-red-600';
            default: return 'text-gray-400';
        }
    };

    const getStatusIcon = () => {
        return connectionStatus === 'SUBSCRIBED' ? <Wifi size={16} /> : <WifiOff size={16} />;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Safe Harbor Chat</h1>
                    <p className="mt-1 text-slate-500">A real-time public chat for all platform members.</p>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                    <div className={`flex items-center gap-1 ${getStatusColor()}`}>
                        {getStatusIcon()}
                        <span>{connectionStatus}</span>
                    </div>
                    <button 
                        onClick={handleManualRefresh}
                        className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded-md text-slate-600 text-xs"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {lastMessageTime && (
                <div className="text-xs text-slate-400">
                    Last message received: {new Date(lastMessageTime).toLocaleString()}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[75vh]">
                {/* Message Display Area */}
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {messages.map(msg => {
                        const isCurrentUser = msg.sender_username === userProfile?.username;
                        const userStyles = !isCurrentUser ? getUserColorStyles(msg.sender_username) : {};

                        return (
                            <div key={msg.id} className={`flex items-start gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                {!isCurrentUser && (
                                    <img 
                                        src={`https://placehold.co/40x40/E2E8F0/475569?text=${msg.sender_username.charAt(0).toUpperCase()}`} 
                                        alt={msg.sender_username} 
                                        className="w-10 h-10 rounded-full flex-shrink-0"
                                    />
                                )}
                                <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-3 rounded-2xl max-w-sm md:max-w-md ${
                                        isCurrentUser 
                                        ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-br-none' 
                                        : `${userStyles.bg} text-slate-800 rounded-bl-none`
                                    }`}>
                                        {!isCurrentUser && (
                                             <p className={`text-sm font-semibold mb-1 ${userStyles.text}`}>{msg.sender_username}</p>
                                        )}
                                        <p className="text-sm">{msg.content}</p>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1.5 px-1">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                 {isCurrentUser && (
                                    <img 
                                        src={userProfile?.avatar_url || `https://placehold.co/40x40/E2E8F0/475569?text=${msg.sender_username.charAt(0).toUpperCase()}`} 
                                        alt={msg.sender_username} 
                                        className="w-10 h-10 rounded-full flex-shrink-0"
                                    />
                                )}
                            </div>
                        );
                    })}
                     {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                           <MessageSquare size={48}/>
                           <p className="mt-2 text-sm">No messages yet. Start the conversation!</p>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input Form */}
                <div className="p-4 bg-slate-50/50 border-t border-slate-200">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={!userProfile}
                        />
                        <button 
                            type="submit" 
                            className="p-3 rounded-full text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0" 
                            disabled={!userProfile || !newMessage.trim()}
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Debug Info (remove in production) */}
            <div className="text-xs text-slate-400 bg-slate-50 p-2 rounded">
                <div>Messages in state: {messages.length}</div>
                <div>Connection: {connectionStatus}</div>
                <div>User: {userProfile?.username || 'Loading...'}</div>
            </div>
        </div>
    );
};

export default ChatPage;