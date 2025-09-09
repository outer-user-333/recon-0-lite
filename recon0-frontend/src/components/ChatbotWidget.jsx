import React, { useState, useEffect, useRef } from 'react';
import { askChatbot } from '../lib/apiService.js';
import { Bot, X, Send, LoaderCircle } from 'lucide-react';

const ChatbotWidget = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([{ sender: 'ai', text: 'Hello! How can I help you with Recon-0 today?' }]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Scroll to bottom when new messages are added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // This logic is unchanged
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = { sender: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const result = await askChatbot(inputValue);
            if (result.success) {
                const aiMessage = { sender: 'ai', text: result.data.answer };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                 throw new Error(result.message || "Failed to get a response.");
            }
        } catch (error) {
            const errorMessage = { sender: 'ai', text: 'Sorry, I am having trouble connecting. Please try again later.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const chatWindowClass = isOpen ? 'flex' : 'hidden';

    return (
        // FIX: Adjusted positioning classes to ensure it's fixed at the bottom right corner.
        <div className={`fixed bottom-8 right-8 w-[380px] max-w-[calc(100vw-32px)] h-[500px] max-h-[calc(100vh-80px)] bg-gradient-to-br from-white via-blue-50 to-violet-50 rounded-2xl shadow-2xl z-50 flex-col border-2 border-violet-200 transform transition-all duration-300 backdrop-blur-sm ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'} ${chatWindowClass} overflow-hidden`}>
            
            {/* Colorful background decorations */}
            <div className="absolute top-2 right-2 w-12 h-12 bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full opacity-30"></div>
            <div className="absolute top-1/2 left-2 w-6 h-6 bg-gradient-to-br from-rose-300 to-rose-400 rounded-full opacity-25 animate-ping"></div>
            
            {/* Header with gradient background */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b-2 border-violet-200 bg-gradient-to-r from-violet-100 to-blue-100 rounded-t-xl relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-blue-500 flex items-center justify-center shadow-lg">
                        <Bot className="text-white" size={18}/>
                    </div>
                    <h3 className="font-bold text-slate-900">AI Assistant</h3>
                </div>
                <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-gradient-to-br hover:from-rose-400 hover:to-rose-500 rounded-full transition-all duration-200 shadow-sm">
                    <X size={18} />
                </button>
            </div>

            {/* Messages area with colorful background */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(239,246,255,0.9) 50%, rgba(245,243,255,0.9) 100%)'
            }}>
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                         {msg.sender === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-md">
                                <Bot size={16} className="text-white" />
                            </div>
                         )}
                        <div className={`p-3 rounded-2xl max-w-md text-sm shadow-lg ${
                            msg.sender === 'user' 
                                ? 'bg-gradient-to-br from-blue-500 to-violet-500 text-white rounded-br-none border border-blue-400' 
                                : 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-3">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md">
                            <Bot size={16} className="text-white" />
                         </div>
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 text-sm rounded-bl-none border border-orange-200 shadow-lg">
                            <LoaderCircle className="animate-spin" size={20}/>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form with colorful styling */}
            <div className="flex-shrink-0 p-4 border-t-2 border-violet-200 bg-gradient-to-r from-blue-100 to-violet-100 rounded-b-xl relative z-10">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-gradient-to-r from-white to-blue-50 border-2 border-blue-300 rounded-full focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none transition-all shadow-inner text-slate-900 placeholder-slate-500"
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                        placeholder="Ask me anything about Recon-0..." 
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        className="p-3 rounded-full text-white bg-gradient-to-br from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 shadow-lg transform hover:scale-105 active:scale-95" 
                        disabled={isLoading || !inputValue.trim()}
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatbotWidget;

