import React, { useState } from 'react';
import type { Suggestion } from '../types';
import { WidgetCard } from './WidgetCard';
import { LightbulbIcon } from './Icons';

const SuggestionForm: React.FC<{ onSubmit: (suggestion: Suggestion) => void }> = ({ onSubmit }) => {
    const [area, setArea] = useState<'HR' | 'IT' | 'Office Management' | 'Productivity'>('Productivity');
    const [suggestion, setSuggestion] = useState('');
    const [motivation, setMotivation] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!suggestion.trim() || !motivation.trim()) {
            alert("Please fill out all fields.");
            return;
        }
        onSubmit({
            id: `sug-${Date.now()}`,
            area,
            suggestion,
            motivation,
            submittedBy: 'Alex Chen', // Hardcoded for current user
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        });
        setSuggestion('');
        setMotivation('');
    }

    return (
        <WidgetCard title="Submit a Suggestion" icon={<LightbulbIcon className="h-6 w-6 text-blue-500" />} showViewAll={false}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area di intervento</label>
                    <select id="area" value={area} onChange={e => setArea(e.target.value as any)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                        <option>Productivity</option>
                        <option>HR</option>
                        <option>IT</option>
                        <option>Office Management</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="suggestion" className="block text-sm font-medium text-gray-700">Suggerimento</label>
                    <textarea id="suggestion" value={suggestion} onChange={e => setSuggestion(e.target.value)} rows={4} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" placeholder="What's your idea?"></textarea>
                </div>
                <div>
                    <label htmlFor="motivation" className="block text-sm font-medium text-gray-700">Motivazione del suggerimento</label>
                    <textarea id="motivation" value={motivation} onChange={e => setMotivation(e.target.value)} rows={4} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" placeholder="Why would this be a good change?"></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Submit Suggestion</button>
            </form>
        </WidgetCard>
    );
};

const SuggestionsList: React.FC<{ suggestions: Suggestion[] }> = ({ suggestions }) => (
    <WidgetCard title="Recent Suggestions" icon={<LightbulbIcon className="h-6 w-6 text-yellow-500" />} showViewAll={false}>
        <div className="space-y-4">
            {suggestions.map(s => (
                <div key={s.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-baseline">
                        <span className="px-2 py-1 text-xs font-medium text-white bg-gray-600 rounded-full">{s.area}</span>
                        <p className="text-xs text-gray-500">{s.date}</p>
                    </div>
                    <h4 className="font-semibold text-gray-800 mt-2">{s.suggestion}</h4>
                    <p className="text-sm text-gray-600 mt-1">{s.motivation}</p>
                    <p className="text-xs text-right text-gray-500 mt-2">- {s.submittedBy}</p>
                </div>
            ))}
        </div>
    </WidgetCard>
);

export const SuggestionsPage: React.FC<{ initialSuggestions: Suggestion[] }> = ({ initialSuggestions }) => {
    const [suggestions, setSuggestions] = useState(initialSuggestions);

    const handleAddSuggestion = (newSuggestion: Suggestion) => {
        setSuggestions(prev => [newSuggestion, ...prev]);
    };

    return (
        <div className="container mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Suggestions</h1>
            <p className="text-gray-500 mb-8">Share your ideas to help us improve.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <SuggestionForm onSubmit={handleAddSuggestion} />
                </div>
                <div className="lg:col-span-2">
                    <SuggestionsList suggestions={suggestions} />
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
