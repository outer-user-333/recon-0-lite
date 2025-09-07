import React, { useState } from 'react';
import { askChatbot } from '../lib/apiService';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ sender: 'ai', text: 'Hello! How can I help you with Recon-0 today?' }]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

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
            }
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            const errorMessage = { sender: 'ai', text: 'Sorry, I am having trouble connecting. Please try again later.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <style>{`
                .chatbot-widget-fab { position: fixed; bottom: 30px; right: 30px; z-index: 1000; }
                .chat-window { position: fixed; bottom: 100px; right: 30px; width: 370px; max-width: 90vw; background: #1f2937; border-radius: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 1000; display: ${isOpen ? 'flex' : 'none'}; flex-direction: column; }
                .chat-messages { height: 400px; overflow-y: auto; padding: 20px; }
                .message { margin-bottom: 15px; }
                .message-text { padding: 10px 15px; border-radius: 20px; max-width: 80%; }
                .user-message { background: #34d399; color: #111827; margin-left: auto; }
                .ai-message { background: #374151; color: #f3f4f6; }
            `}</style>

            <button onClick={toggleChat} className="btn btn-primary btn-lg rounded-circle chatbot-widget-fab shadow-lg">
                <i className="fas fa-robot"></i>
            </button>

            <div className="chat-window">
                <div className="card-header bg-dark text-white text-center">AI Assistant</div>
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message d-flex ${msg.sender === 'user' ? 'justify-content-end' : ''}`}>
                            <div className={`message-text ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && <p className="text-muted text-center">AI is thinking...</p>}
                </div>
                <div className="card-footer">
                    <form onSubmit={handleSendMessage} className="d-flex">
                        <input type="text" className="form-control" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Ask a question..." />
                        <button type="submit" className="btn btn-primary ms-2" disabled={isLoading}>Send</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ChatbotWidget;