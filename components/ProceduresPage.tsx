import React, { useState, useRef, useEffect } from 'react';
import { MOCK_PROCEDURE_DOCS } from '../constants';
import { getAiResponse } from '../services/geminiService';
import type { ProcedureDoc, ChatMessage } from '../types';
import { SendIcon, UserIcon, BotIcon, UploadIcon } from './Icons';

const Spinner = () => (
    <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
);

export const ProceduresPage: React.FC = () => {
    const [procedureDocs, setProcedureDocs] = useState<ProcedureDoc[]>(MOCK_PROCEDURE_DOCS);
    const [selectedDoc, setSelectedDoc] = useState<ProcedureDoc | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const handleDocSelect = (doc: ProcedureDoc) => {
        setSelectedDoc(doc);
        setChatHistory([
            { role: 'model', text: `Sono pronto a rispondere a domande sul documento "${doc.name}". Come posso aiutarti?` }
        ]);
        setQuery('');
    };
    
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const docName = file.name.replace(/\.[^/.]+$/, "");
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        if (fileExtension === 'txt' || fileExtension === 'md') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                if (content) {
                    const newDoc: ProcedureDoc = {
                        id: `uploaded-${Date.now()}`,
                        name: docName,
                        category: 'Caricati',
                        content: content,
                    };
                    setProcedureDocs(prevDocs => [...prevDocs, newDoc]);
                    handleDocSelect(newDoc);
                }
            };
            reader.readAsText(file);
        } else if (fileExtension === 'pdf' || fileExtension === 'doc' || fileExtension === 'docx') {
            // In a real application, this would require a server-side service or a heavy 
            // client-side library (like PDF.js or mammoth.js) to parse the file content.
            // For this demo, we'll simulate the content extraction.
            const simulatedContent = `Il contenuto del file "${file.name}" è stato indicizzato e reso disponibile per l'assistente AI. 
            
(Nota: l'estrazione del testo da file PDF e DOC in questa demo è simulata per semplicità. L'assistente risponderà come se avesse accesso al contenuto completo del documento.)`;

            const newDoc: ProcedureDoc = {
                id: `uploaded-${Date.now()}`,
                name: docName,
                category: 'Caricati',
                content: simulatedContent,
            };
            setProcedureDocs(prevDocs => [...prevDocs, newDoc]);
            handleDocSelect(newDoc);
        } else {
            alert("Tipo di file non supportato. Si prega di caricare file .txt, .md, .pdf, .doc, o .docx.");
        }

        // Reset input to allow re-uploading the same file
        event.target.value = '';
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || !selectedDoc || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: query };
        setChatHistory(prev => [...prev, userMessage]);
        setQuery('');
        setIsLoading(true);

        const response = await getAiResponse(selectedDoc.content, query, chatHistory);

        const modelMessage: ChatMessage = { role: 'model', text: response };
        setChatHistory(prev => [...prev, modelMessage]);
        setIsLoading(false);
    };
    
    const docCategories = [...new Set(procedureDocs.map(d => d.category))];

    return (
        <div className="p-8 h-full flex flex-col">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Procedure e Qualità</h1>
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
                
                {/* Document List */}
                <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-slate-800">Seleziona Documento</h2>
                         <button 
                            onClick={handleUploadClick}
                            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Carica un documento"
                            aria-label="Carica un documento"
                        >
                            <UploadIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">Scegli un documento o caricane uno nuovo per avviare una conversazione con l'assistente AI.</p>
                     <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept=".txt,.md,.pdf,.doc,.docx"
                    />
                    <div className="flex-grow overflow-y-auto pr-2">
                        {docCategories.map(category => (
                            <div key={category} className="mb-4">
                                <h3 className="font-semibold text-slate-600 mb-2">{category}</h3>
                                <ul className="space-y-2">
                                    {procedureDocs.filter(d => d.category === category).map(doc => (
                                        <li key={doc.id}>
                                            <button
                                                onClick={() => handleDocSelect(doc)}
                                                className={`w-full text-left p-3 rounded-lg transition-colors text-sm ${selectedDoc?.id === doc.id ? 'bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                                            >
                                                {doc.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Interface */}
                <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2 flex flex-col">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Assistente AI</h2>
                    <div className="flex-grow border border-slate-200 rounded-lg p-4 flex flex-col space-y-4 overflow-y-auto bg-slate-50 min-h-0">
                        {chatHistory.length === 0 ? (
                            <div className="m-auto text-center text-slate-500">
                                Seleziona un documento per iniziare.
                            </div>
                        ) : (
                            chatHistory.map((msg, index) => (
                                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center"><BotIcon className="w-5 h-5 text-slate-500"/></div>}
                                    <div className={`max-w-md p-3 rounded-lg whitespace-pre-wrap ${msg.role === 'user' ? 'bg-slate-700 text-white' : 'bg-white text-slate-700'}`}>
                                        {msg.text}
                                    </div>
                                    {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center"><UserIcon className="w-5 h-5 text-slate-500"/></div>}
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="flex items-start gap-3 justify-start">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center"><BotIcon className="w-5 h-5 text-slate-500"/></div>
                                <div className="max-w-md p-3 rounded-lg bg-white text-slate-700 flex items-center">
                                    <Spinner />
                                    <span className="ml-2">Sto pensando...</span>
                                </div>
                            </div>
                        )}
                         <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-3">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={selectedDoc ? `Chiedi riguardo a "${selectedDoc.name}"...` : "Seleziona prima un documento"}
                            disabled={!selectedDoc || isLoading}
                            className="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none disabled:bg-slate-100"
                        />
                        <button
                            type="submit"
                            disabled={!selectedDoc || isLoading || !query.trim()}
                            className="p-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {isLoading ? <Spinner /> : <SendIcon className="w-5 h-5" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};