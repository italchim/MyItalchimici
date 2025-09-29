import React, { useState } from 'react';
import { LogoIcon } from './Icons';

interface ApiKeyPageProps {
    onSubmit: (apiKey: string) => void;
}

export const ApiKeyPage: React.FC<ApiKeyPageProps> = ({ onSubmit }) => {
    const [apiKey, setApiKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey.trim()) {
            onSubmit(apiKey.trim());
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-lg m-4 animate-fade-in">
                <div className="flex flex-col items-center">
                    <LogoIcon className="h-12 w-12 text-gray-800" />
                    <h1 className="mt-4 text-2xl font-bold text-center text-gray-900">
                        One Last Step
                    </h1>
                    <p className="mt-2 text-sm text-center text-gray-500">
                        Please provide your Google AI Gemini API key to activate the intranet's AI features.
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 sr-only">API Key</label>
                        <input
                            id="api-key"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your API Key"
                            required
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Continue to Intranet
                    </button>
                </form>

                 <div className="text-center">
                    <p className="text-xs text-gray-400">
                        Your API key is stored securely in your browser's session storage and is never saved on any server. It will be cleared when you close this tab.
                    </p>
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
