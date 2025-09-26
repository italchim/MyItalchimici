import React, { useState, useEffect, useRef } from 'react';
import { askPolicyQuestion } from '../services/geminiService';
import type { ChatMessage, PolicyDocument } from '../types';
import { PolicyIcon, SendIcon, FilePdfIcon, FileDocIcon, CloudUploadIcon } from './Icons';
import { WidgetCard } from './WidgetCard';


const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1 p-3">
        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
);

interface PoliciesPageProps {
    policies: PolicyDocument[];
    onPoliciesUpdate: (newPolicies: PolicyDocument[]) => void;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ policies, onPoliciesUpdate }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [summaryText, setSummaryText] = useState('');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        const fetchWelcomeMessage = async () => {
            if (messages.length > 0) return; // Only fetch welcome message once
            try {
                const welcomeText = await askPolicyQuestion("Hello, what can you do?", policies);
                setMessages([{ id: 'welcome', sender: 'ai', text: welcomeText }]);
            } catch (error) {
                 setMessages([{ id: 'welcome-error', sender: 'ai', text: 'Sorry, I am having trouble connecting. Please try again later.' }]);
                 console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        if (policies.length > 0) {
           fetchWelcomeMessage();
        } else {
            setIsLoading(false);
            setMessages([{ id: 'no-docs', sender: 'ai', text: 'Welcome! The document library is currently empty. Please upload a policy document to begin.' }])
        }
    }, [policies]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const aiResponseText = await askPolicyQuestion(currentInput, policies);
            const aiMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponseText };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: 'Sorry, something went wrong. Please try your question again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFileUploadClick = () => fileInputRef.current?.click();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setSummaryText('');
            setIsModalOpen(true);
        }
        if(event.target) event.target.value = ''; // Allow re-uploading the same file
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
        setSummaryText('');
    };

    const handleSaveDocument = () => {
        if (!selectedFile || !summaryText.trim()) {
            alert("Please provide a summary for the document.");
            return;
        }
        const newDocument: PolicyDocument = {
            id: `doc-${Date.now()}`,
            title: selectedFile.name,
            type: selectedFile.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOCX',
            summary: summaryText,
            lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        };
        onPoliciesUpdate([...policies, newDocument]);
        handleModalClose();
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) handleSend();
    };

    const uploadButton = (
        <button
            onClick={handleFileUploadClick}
            className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
            <CloudUploadIcon className="h-5 w-5" />
            <span>Upload</span>
        </button>
    );

    return (
        <div className="container mx-auto animate-fade-in">
             <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.docx,.doc"
            />
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Policies & Procedures</h1>
                <p className="text-gray-500">Browse the library or ask the AI assistant for help.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                <div className="lg:col-span-1">
                    <WidgetCard title="Document Library" icon={<PolicyIcon className="h-6 w-6 text-gray-700" />} showViewAll={false} headerAction={uploadButton}>
                        <div className="space-y-3">
                            {policies.map(doc => (
                                <div key={doc.id} className="flex items-center p-2 -m-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                    {doc.type === 'PDF' ? <FilePdfIcon className="h-8 w-8 text-red-600 shrink-0" /> : <FileDocIcon className="h-8 w-8 text-blue-600 shrink-0" />}
                                    <div className="ml-3 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                                        <p className="text-xs text-gray-500">Last updated: {doc.lastUpdated}</p>
                                    </div>
                                </div>
                            ))}
                            {policies.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No documents found.</p>
                                    <p className="text-sm">Click "Upload" to add a new policy.</p>
                                </div>
                            )}
                        </div>
                    </WidgetCard>
                </div>

                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">AI Assistant</h3>
                    </div>
                    <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                               {msg.sender === 'ai' && <div className="flex-shrink-0 bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center"><PolicyIcon className="h-5 w-5 text-gray-600"/></div>}
                                <div className={`max-w-xl px-4 py-2 rounded-xl ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && messages.length > 0 && (
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
                                disabled={isLoading || policies.length === 0}
                                aria-label="Ask a question about policies"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={isLoading || !input.trim() || policies.length === 0}
                                className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-gray-500 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                                aria-label="Send message"
                            >
                                <SendIcon className="h-6 w-6"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && selectedFile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg m-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Upload New Policy</h2>
                        <p className="text-sm text-gray-600 mb-4">Provide a summary for <span className="font-medium text-gray-900">{selectedFile.name}</span>. The AI will use this text to answer questions.</p>
                        <textarea
                            value={summaryText}
                            onChange={(e) => setSummaryText(e.target.value)}
                            rows={8}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Paste or write a detailed summary of the document here..."
                        />
                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={handleModalClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                            <button onClick={handleSaveDocument} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={!summaryText.trim()}>Save Document</button>
                        </div>
                    </div>
                </div>
            )}
             <style>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};