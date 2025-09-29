import React, { useState, useMemo } from 'react';
import type { ForumThread, ForumPost } from '../types';
import { WidgetCard } from './WidgetCard';
import { ForumIcon, ChevronLeftIcon } from './Icons';

const NewThreadForm: React.FC<{
    onSubmit: (title: string, content: string) => void;
    onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert('Please provide a title and content for your post.');
            return;
        }
        onSubmit(title, content);
    };

    return (
        <WidgetCard title="Start a New Discussion" icon={<ForumIcon className="h-6 w-6 text-blue-500" />} showViewAll={false}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="thread-title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        id="thread-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        placeholder="What is your discussion about?"
                    />
                </div>
                <div>
                    <label htmlFor="thread-content" className="block text-sm font-medium text-gray-700">Your Message</label>
                    <textarea
                        id="thread-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={6}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        placeholder="Start the conversation here..."
                    ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                    <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">Cancel</button>
                    <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Post Discussion</button>
                </div>
            </form>
        </WidgetCard>
    );
};

const ThreadDetailView: React.FC<{
    thread: ForumThread;
    onAddReply: (content: string) => void;
}> = ({ thread, onAddReply }) => {
    const [replyContent, setReplyContent] = useState('');

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;
        onAddReply(replyContent);
        setReplyContent('');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">{thread.title}</h2>
            {thread.posts.map((post, index) => (
                <div key={post.id} className={`flex items-start space-x-4 ${index > 0 ? 'ml-4' : ''}`}>
                    <img src={post.authorAvatarUrl} alt={post.authorName} className="h-10 w-10 rounded-full mt-1" />
                    <div className="flex-1 bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-gray-900">{post.authorName}</p>
                            <p className="text-xs text-gray-500">{post.timestamp}</p>
                        </div>
                        <p className="text-gray-700 mt-2 whitespace-pre-wrap">{post.content}</p>
                    </div>
                </div>
            ))}
            <div className="ml-4">
                 <WidgetCard title="Add a Reply" icon={<ForumIcon className="h-5 w-5 text-gray-600" />} showViewAll={false}>
                     <form onSubmit={handleReplySubmit} className="space-y-3">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={4}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder="Write your reply..."
                        ></textarea>
                        <div className="text-right">
                            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Post Reply</button>
                        </div>
                    </form>
                 </WidgetCard>
            </div>
        </div>
    );
};

export const ForumPage: React.FC<{ initialThreads: ForumThread[] }> = ({ initialThreads }) => {
    const [threads, setThreads] = useState(initialThreads);
    const [view, setView] = useState<'list' | 'thread' | 'create'>('list');
    const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

    const activeThread = useMemo(() => threads.find(t => t.id === activeThreadId), [threads, activeThreadId]);

    const handleCreateThread = (title: string, content: string) => {
        const newPost: ForumPost = {
            id: `post-${Date.now()}`,
            authorName: 'Alex Chen',
            authorAvatarUrl: 'https://picsum.photos/100/100',
            content,
            timestamp: 'Just now',
        };
        const newThread: ForumThread = {
            id: `thread-${Date.now()}`,
            title,
            authorName: 'Alex Chen',
            authorAvatarUrl: 'https://picsum.photos/100/100',
            createdAt: 'Just now',
            postCount: 1,
            lastReply: { authorName: 'Alex Chen', timestamp: 'Just now' },
            posts: [newPost],
        };
        setThreads(prev => [newThread, ...prev]);
        setView('list');
    };

    const handleAddReply = (content: string) => {
        if (!activeThreadId) return;
        const newPost: ForumPost = {
            id: `post-${Date.now()}`,
            authorName: 'Alex Chen',
            authorAvatarUrl: 'https://picsum.photos/100/100',
            content,
            timestamp: 'Just now',
        };
        setThreads(prevThreads => prevThreads.map(thread => {
            if (thread.id === activeThreadId) {
                return {
                    ...thread,
                    posts: [...thread.posts, newPost],
                    postCount: thread.postCount + 1,
                    lastReply: { authorName: 'Alex Chen', timestamp: 'Just now' },
                };
            }
            return thread;
        }));
    };
    
    const renderContent = () => {
        switch (view) {
            case 'create':
                return <NewThreadForm onSubmit={handleCreateThread} onCancel={() => setView('list')} />;
            case 'thread':
                if (activeThread) {
                    return <ThreadDetailView thread={activeThread} onAddReply={handleAddReply} />;
                }
                setView('list'); // Fallback if thread not found
                return null;
            case 'list':
            default:
                return (
                    <WidgetCard title="Discussions" icon={<ForumIcon className="h-6 w-6 text-indigo-500" />} showViewAll={false}>
                        <div className="text-right mb-4">
                            <button onClick={() => setView('create')} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Start a New Discussion
                            </button>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {threads.map(thread => (
                                <li key={thread.id} className="p-4 hover:bg-gray-50 cursor-pointer -mx-4 px-4" onClick={() => { setActiveThreadId(thread.id); setView('thread'); }}>
                                    <div className="flex items-center space-x-4">
                                        <img src={thread.authorAvatarUrl} alt={thread.authorName} className="h-10 w-10 rounded-full" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-md font-semibold text-gray-900 truncate">{thread.title}</p>
                                            <p className="text-sm text-gray-500">
                                                Started by <span className="font-medium">{thread.authorName}</span> &middot; {thread.createdAt}
                                            </p>
                                        </div>
                                        <div className="text-right text-sm text-gray-500 hidden sm:block">
                                            <p>{thread.postCount} posts</p>
                                            <p>Last reply {thread.lastReply.timestamp}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </WidgetCard>
                );
        }
    };

    return (
        <div className="container mx-auto animate-fade-in">
            <div className="flex items-center mb-8">
                {view !== 'list' && (
                    <button onClick={() => setView('list')} className="mr-4 p-2 rounded-full hover:bg-gray-200">
                        <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
                    </button>
                )}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Forum</h1>
                    <p className="text-gray-500">Discuss topics with your colleagues.</p>
                </div>
            </div>
            {renderContent()}
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
