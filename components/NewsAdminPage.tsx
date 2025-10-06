import React, { useState, useMemo } from 'react';
import type { NewsArticle, User } from '../types';
import { PlusCircleIcon, TrashIcon } from './Icons';

interface NewsAdminPageProps {
  allNews: NewsArticle[];
  allEmployees: User[];
  onUpdateNews: React.Dispatch<React.SetStateAction<NewsArticle[]>>;
}

const NewsCreator: React.FC<{
    onAddNews: (title: string, content: string) => void;
    onDeleteNews: (id: string) => void;
    onClearSelection: () => void;
    selectedArticle: NewsArticle | null;
}> = ({ onAddNews, onDeleteNews, onClearSelection, selectedArticle }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert('Titolo e contenuto non possono essere vuoti.');
            return;
        }
        onAddNews(title, content);
        setTitle('');
        setContent('');
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">{ selectedArticle ? "Dettagli Annuncio" : "Crea Annuncio"}</h2>
            {selectedArticle ? (
                <div>
                     <button onClick={onClearSelection} className="text-sm text-slate-600 hover:underline mb-4">&larr; Torna a Crea Annuncio</button>
                     <h3 className="text-lg font-bold text-slate-900">{selectedArticle.title}</h3>
                     <p className="text-xs text-slate-500 mb-4">{selectedArticle.date}</p>
                     <div className="bg-slate-50 p-4 rounded-lg text-slate-700 whitespace-pre-wrap max-h-60 overflow-y-auto">
                        {selectedArticle.content}
                     </div>
                     <div className="mt-4 text-right">
                        <button 
                            onClick={() => {
                                if (window.confirm(`Sei sicuro di voler eliminare l'annuncio "${selectedArticle.title}"?`)) {
                                    onDeleteNews(selectedArticle.id)
                                }
                            }}
                            className="inline-flex items-center gap-2 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                            <TrashIcon className="w-4 h-4" />
                            Elimina
                        </button>
                     </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="news-title" className="block text-sm font-medium text-slate-700">Titolo</label>
                        <input
                            type="text"
                            id="news-title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="mt-1 block w-full p-2 border border-slate-300 rounded-lg shadow-sm focus:ring-slate-500 focus:border-slate-500"
                            placeholder="Titolo dell'annuncio"
                        />
                    </div>
                    <div>
                        <label htmlFor="news-content" className="block text-sm font-medium text-slate-700">Contenuto</label>
                        <textarea
                            id="news-content"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows={8}
                            className="mt-1 block w-full p-2 border border-slate-300 rounded-lg shadow-sm focus:ring-slate-500 focus:border-slate-500"
                            placeholder="Scrivi qui il contenuto completo dell'annuncio..."
                        ></textarea>
                    </div>
                    <div className="text-right">
                        <button type="submit" className="bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg hover:bg-slate-800 transition-colors">
                            Pubblica
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

const ReadStatus: React.FC<{ article: NewsArticle; employees: User[] }> = ({ article, employees }) => {
    const [activeTab, setActiveTab] = useState<'read' | 'unread'>('read');

    const readUsers = useMemo(() => employees.filter(e => article.readBy.includes(e.email)), [article, employees]);
    const unreadUsers = useMemo(() => employees.filter(e => !article.readBy.includes(e.email)), [article, employees]);

    const UserList: React.FC<{users: User[]}> = ({users}) => (
        <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {users.map(user => (
                <li key={user.email} className="flex items-center gap-3">
                    <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                    <div>
                        <p className="text-sm font-medium text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                </li>
            ))}
        </ul>
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Stato Lettura</h2>
            <div>
                <div className="border-b border-slate-200">
                    <nav className="-mb-px flex space-x-6">
                        <button onClick={() => setActiveTab('read')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'read' ? 'border-slate-500 text-slate-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                            Letti ({readUsers.length})
                        </button>
                         <button onClick={() => setActiveTab('unread')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'unread' ? 'border-slate-500 text-slate-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                            Non Letti ({unreadUsers.length})
                        </button>
                    </nav>
                </div>
                <div className="pt-6">
                    {activeTab === 'read' ? <UserList users={readUsers} /> : <UserList users={unreadUsers} />}
                </div>
            </div>
        </div>
    );
}


export const NewsAdminPage: React.FC<NewsAdminPageProps> = ({ allNews, allEmployees, onUpdateNews }) => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const sortedNews = useMemo(() => {
    return [...allNews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allNews]);

  const handleAddNews = (title: string, content: string) => {
    const newArticle: NewsArticle = {
        id: `news-${Date.now()}`,
        title,
        excerpt: content.substring(0, 100) + '...',
        content,
        date: new Date().toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' }),
        readBy: [],
    };
    onUpdateNews(prev => [newArticle, ...prev]);
  };

  const handleDeleteNews = (id: string) => {
    onUpdateNews(prev => prev.filter(news => news.id !== id));
    setSelectedArticle(null);
  };


  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Pannello Amministrazione Annunci</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column - News List */}
        <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Annunci Pubblicati</h2>
            <div className="bg-white rounded-lg shadow-md p-4 space-y-3 max-h-[75vh] overflow-y-auto">
                {sortedNews.map(news => {
                    const readPercentage = allEmployees.length > 0 ? (news.readBy.length / allEmployees.length) * 100 : 0;
                    return (
                        <button key={news.id} onClick={() => setSelectedArticle(news)} className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedArticle?.id === news.id ? 'bg-slate-100 border-slate-400' : 'bg-white border-transparent hover:border-slate-300 hover:bg-slate-50'}`}>
                            <p className="font-semibold text-slate-800">{news.title}</p>
                            <p className="text-xs text-slate-500 mb-2">{news.date}</p>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                                <div className="bg-slate-600 h-2.5 rounded-full" style={{width: `${readPercentage}%`}}></div>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">{news.readBy.length} di {allEmployees.length} letture</p>
                        </button>
                    )
                })}
            </div>
        </div>

        {/* Right Column - Editor / Details */}
        <div className="lg:col-span-2">
            <NewsCreator 
                onAddNews={handleAddNews}
                onDeleteNews={handleDeleteNews}
                selectedArticle={selectedArticle}
                onClearSelection={() => setSelectedArticle(null)}
            />
            {selectedArticle && <ReadStatus article={selectedArticle} employees={allEmployees} />}
        </div>
      </div>
    </div>
  );
};