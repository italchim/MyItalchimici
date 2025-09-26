import React, { useState, useEffect, useRef } from 'react';
import { askPolicyQuestion } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { PolicyIcon, SendIcon } from './Icons';

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1 p-3">
        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
);

export const PoliciesPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        // Initial welcome message from the AI
        const fetchWelcomeMessage = async () => {
            try {
                const welcomeText = await askPolicyQuestion("Hello");
                setMessages([{ id: 'welcome', sender: 'ai', text: welcomeText }]);
            } catch (error) {
                 setMessages([{ id: 'welcome-error', sender: 'ai', text: 'Sorry, I am having trouble connecting. Please try again later.' }]);
                 console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWelcomeMessage();
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponseText = await askPolicyQuestion(input);
            const aiMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponseText };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: 'Sorry, something went wrong. Please try your question again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSend();
        }
    };

    return (
        <div className="container mx-auto flex flex-col h-full max-h-[calc(100vh-120px)] animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Policies & Procedures Assistant</h1>
                <p className="text-gray-500">Ask me anything about our company policies.</p>
            </div>
            
            <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                           {msg.sender === 'ai' && <div className="flex-shrink-0 bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center"><PolicyIcon className="h-5 w-5 text-gray-600"/></div>}
                            <div className={`max-w-lg px-4 py-2 rounded-xl ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-end gap-2 justify-start">
                            <div className="flex-shrink-0 bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center"><PolicyIcon className="h-5 w-5 text-gray-600"/></div>
                            <div className="bg-gray-100 rounded-xl">
                               <TypingIndicator />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask about remote work, vacation policy, etc."
                            className="w-full bg-gray-100 border-gray-200 rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                            aria-label="Ask a question about policies"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-gray-500 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                            aria-label="Send message"
                        >
                            <SendIcon className="h-6 w-6"/>
                        </button>
                    </div>
                </div>
            </div>
             <style>{`
                @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
