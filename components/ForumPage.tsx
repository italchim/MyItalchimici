import React, { useState, useMemo } from 'react';
import { MOCK_FORUM_POSTS, MOCK_USER } from '../constants';
import type { ForumPost } from '../types';

const formatRelativeTime = (isoDate: string): string => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds} secondi fa`;

    const diffMinutes = Math.round(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} minuti fa`;

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} ore fa`;

    const diffDays = Math.round(diffHours / 24);
    if (diffDays <= 7) return `${diffDays} giorni fa`;

    return date.toLocaleDateString('it-IT');
};

const ForumPostCard: React.FC<{ post: ForumPost }> = ({ post }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start space-x-4">
            <img src={post.author.avatarUrl} alt={post.author.name} className="w-12 h-12 rounded-full flex-shrink-0" />
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-800">{post.title}</h3>
                <p className="text-sm text-slate-500">
                    Pubblicato da <span className="font-medium">{post.author.name}</span> &bull; {formatRelativeTime(post.timestamp)}
                </p>
                <p className="mt-4 text-slate-700 whitespace-pre-wrap">{post.content}</p>
            </div>
        </div>
        <div className="mt-6 border-t border-slate-200 pt-4">
            <h4 className="text-sm font-semibold text-slate-600 mb-3">{post.comments.length} Commento(i)</h4>
            <div className="space-y-4">
                {post.comments.map(comment => (
                    <div key={comment.id} className="flex items-start space-x-3">
                        <img src={comment.author.avatarUrl} alt={comment.author.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                        <div className="flex-1 bg-slate-100 p-3 rounded-lg">
                            <p className="text-sm font-semibold text-slate-800">{comment.author.name} <span className="text-xs text-slate-500 font-normal">&bull; {formatRelativeTime(comment.timestamp)}</span></p>
                            <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{comment.content}</p>
                        </div>
                    </div>
                ))}
                 <div className="flex items-start space-x-3 pt-2">
                    <img src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                    <input type="text" placeholder="Scrivi un commento..." className="flex-1 p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:outline-none" />
                </div>
            </div>
        </div>
    </div>
);

export const ForumPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchAuthor, setSearchAuthor] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleResetFilters = () => {
        setSearchTerm('');
        setSearchAuthor('');
        setStartDate('');
        setEndDate('');
    };

    const filteredPosts = useMemo(() => {
        return MOCK_FORUM_POSTS.filter(post => {
            const searchTermLower = searchTerm.toLowerCase();
            if (searchTerm && !(post.title.toLowerCase().includes(searchTermLower) || post.content.toLowerCase().includes(searchTermLower))) {
                return false;
            }

            const searchAuthorLower = searchAuthor.toLowerCase();
            if (searchAuthor && !post.author.name.toLowerCase().includes(searchAuthorLower)) {
                return false;
            }

            const postDate = new Date(post.timestamp);
            if (startDate) {
                const filterStartDate = new Date(startDate);
                filterStartDate.setHours(0, 0, 0, 0);
                if (postDate < filterStartDate) return false;
            }
            if (endDate) {
                const filterEndDate = new Date(endDate);
                filterEndDate.setHours(23, 59, 59, 999);
                if (postDate > filterEndDate) return false;
            }

            return true;
        });
    }, [searchTerm, searchAuthor, startDate, endDate]);


    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Forum Aziendale</h1>
                <button className="bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors">
                    Crea Nuovo Post
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label htmlFor="search-term" className="block text-sm font-medium text-slate-700">Cerca per parola chiave</label>
                        <input type="text" id="search-term" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Es. macchina del caffè..." className="mt-1 block w-full p-2 border border-slate-300 rounded-lg shadow-sm focus:ring-slate-500 focus:border-slate-500" />
                    </div>
                    <div>
                        <label htmlFor="search-author" className="block text-sm font-medium text-slate-700">Autore</label>
                        <input type="text" id="search-author" value={searchAuthor} onChange={e => setSearchAuthor(e.target.value)} placeholder="Es. Mario Rossi" className="mt-1 block w-full p-2 border border-slate-300 rounded-lg shadow-sm focus:ring-slate-500 focus:border-slate-500" />
                    </div>
                    <div>
                         <button onClick={handleResetFilters} className="w-full bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors">
                            Reimposta Filtri
                        </button>
                    </div>
                     <div>
                        <label htmlFor="start-date" className="block text-sm font-medium text-slate-700">Da</label>
                        <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-lg shadow-sm focus:ring-slate-500 focus:border-slate-500" />
                    </div>
                    <div>
                        <label htmlFor="end-date" className="block text-sm font-medium text-slate-700">A</label>
                        <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-lg shadow-sm focus:ring-slate-500 focus:border-slate-500" />
                    </div>
                </div>
            </div>

            <div className="space-y-8 max-w-4xl mx-auto">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                        <ForumPostCard key={post.id} post={post} />
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-slate-700">Nessun Risultato</h3>
                        <p className="text-slate-500 mt-2">Nessun post trovato con i criteri di ricerca attuali. Prova a modificare i filtri.</p>
                    </div>
                )}
            </div>
        </div>
    );
};