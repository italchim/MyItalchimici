import React, { useState, useEffect } from 'react';
import type { UserSettings } from '../types';
import { WidgetCard } from './WidgetCard';
import { SettingsIcon } from './Icons';

interface SettingsPageProps {
    currentSettings: UserSettings;
    onSettingsUpdate: (newSettings: UserSettings) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ currentSettings, onSettingsUpdate }) => {
    const [name, setName] = useState(currentSettings.name);
    const [avatarUrl, setAvatarUrl] = useState(currentSettings.avatarUrl);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [avatarPreview, setAvatarPreview] = useState(currentSettings.avatarUrl);

    useEffect(() => {
        setAvatarPreview(avatarUrl);
    }, [avatarUrl]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaveStatus('saving');
        onSettingsUpdate({ name, avatarUrl });

        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 500);
    };

    const handleAvatarError = () => {
        setAvatarPreview('https://picsum.photos/seed/fallback/200'); // A consistent fallback
    };

    return (
        <div className="container mx-auto max-w-3xl animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-500 mb-8">Manage your personal information and preferences.</p>

            <WidgetCard title="User Profile" icon={<SettingsIcon className="h-6 w-6 text-gray-700" />} showViewAll={false}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center space-x-6">
                        <img 
                            src={avatarPreview} 
                            alt="Avatar Preview" 
                            className="h-24 w-24 rounded-full object-cover bg-gray-200"
                            onError={handleAvatarError}
                        />
                        <div className="flex-grow">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Display Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                                placeholder="e.g., Alex Chen"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700">Avatar URL</label>
                        <input
                            type="text"
                            id="avatarUrl"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                            placeholder="https://example.com/image.png"
                        />
                    </div>

                    <div className="flex justify-end items-center pt-4 border-t border-gray-200">
                        {saveStatus === 'saved' && (
                            <span className="text-sm text-green-600 mr-4 transition-opacity duration-300">
                                Settings saved successfully!
                            </span>
                        )}
                        <button
                            type="submit"
                            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            disabled={saveStatus === 'saving'}
                        >
                            {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </WidgetCard>

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
