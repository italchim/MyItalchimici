import React, { useState, useRef, useEffect } from 'react';
import { ChatIcon, XIcon, SendIcon, UserIcon, BotIcon } from './Icons';
import { getGlobalAiResponse } from '../services/geminiService';
import type { ChatMessage } from '../types';

const Spinner = () => (
    <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
);

interface GlobalChatProps {
    appContext: string;
}

export const GlobalChat: React.FC<GlobalChatProps> = ({ appContext }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setChatHistory([
                { role: 'model', text: 'Ciao! Sono l\'assistente AI di Italchimici. Chiedimi informazioni su notizie, procedure o eventi del giorno.' }
            ]);
            // Focus input when chat opens
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: query };
        const newHistory = [...chatHistory, userMessage];
        setChatHistory(newHistory);
        setQuery('');
        setIsLoading(true);

        const response = await getGlobalAiResponse(query, appContext, newHistory);

        const modelMessage: ChatMessage = { role: 'model', text: response };
        setChatHistory(prev => [...prev, modelMessage]);
        setIsLoading(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 bg-slate-800 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-900 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 z-50"
                aria-label="Apri assistente AI"
            >
                {isOpen ? <XIcon className="w-8 h-8" /> : <ChatIcon className="w-8 h-8" />}
            </button>

            {isOpen && (
                <div className="fixed bottom-28 right-8 w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col h-[70vh] max-h-[600px] z-40 border border-slate-200 animate-fade-in-up">
                    <header className="bg-slate-800 text-white p-4 rounded-t-2xl">
                        <h2 className="text-lg font-semibold">My.Italchimici Assistant</h2>
                    </header>
                    <div className="flex-grow p-4 flex flex-col space-y-4 overflow-y-auto bg-slate-50 min-h-0">
                        {chatHistory.map((msg, index) => (
                             <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center"><BotIcon className="w-5 h-5 text-slate-500"/></div>}
                                <div className={`max-w-xs md:max-w-sm p-3 rounded-xl whitespace-pre-wrap shadow-sm ${msg.role === 'user' ? 'bg-slate-700 text-white' : 'bg-white text-slate-800'}`}>
                                    {msg.text}
                                </div>
                                {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center"><UserIcon className="w-5 h-5 text-slate-500"/></div>}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start gap-3 justify-start">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center"><BotIcon className="w-5 h-5 text-slate-500"/></div>
                                <div className="max-w-md p-3 rounded-xl bg-white text-slate-700 flex items-center shadow-sm">
                                    <Spinner />
                                    <span className="ml-2">Sto pensando...</span>
                                </div>
                            </div>
                        )}
                         <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 flex items-center gap-3 bg-white rounded-b-2xl">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Chiedimi qualcosa..."
                            disabled={isLoading}
                            className="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none disabled:bg-slate-100"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !query.trim()}
                            className="p-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {isLoading ? <Spinner /> : <SendIcon className="w-5 h-5" />}
                        </button>
                    </form>
                    <style>{`
                        @keyframes fade-in-up {
                            0% {
                                opacity: 0;
                                transform: translateY(20px);
                            }
                            100% {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                        .animate-fade-in-up {
                            animation: fade-in-up 0.3s ease-out forwards;
                        }
                    `}</style>
                </div>
            )}
        </>
    );
};
