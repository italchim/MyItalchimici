import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MOCK_USER, NAV_ITEMS, MOCK_DOCS_OWNED, MOCK_DOCS_SHARED, MOCK_SHEETS_OWNED, MOCK_SHEETS_SHARED, MOCK_NEWS, MOCK_EMPLOYEES, MOCK_PROCEDURE_DOCS, MOCK_CALENDAR_EVENTS, MOCK_FORUM_POSTS } from './constants';
import type { User, Page, NewsArticle } from './types';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { FilesPage } from './components/FilesPage';
import { ProceduresPage } from './components/ProceduresPage';
import { ForumPage } from './components/ForumPage';
import { HolidaysPage } from './components/HolidaysPage';
import { NewsAdminPage } from './components/NewsAdminPage';
import { GlobalChat } from './components/GlobalChat';
import { HomeIcon, DocsIcon, SheetsIcon, ProceduresIcon, ForumIcon, LogoutIcon, HolidaysIcon, SearchIcon, MailIcon, CalendarIcon, ChevronDownIcon, TasksIcon, ChatIcon, SettingsIcon } from './components/Icons';

const iconMap: Record<Page, React.FC<React.SVGProps<SVGSVGElement>>> = {
  home: HomeIcon,
  docs: DocsIcon,
  sheets: SheetsIcon,
  procedures: ProceduresIcon,
  forum: ForumIcon,
  holidays: HolidaysIcon,
  'admin-news': SettingsIcon,
};

const Logo = () => (
    <svg className="h-10 w-10 text-slate-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.79 21.79 3 15.5V9l9.79 6.79a2 2 0 0 0 2.42 0L21 9.79"/>
        <path d="M21 15.5V9l-6.53 4.2a2 2 0 0 1-1.94 0L3 9"/>
        <path d="m16.5 6.5-4.5-3-4.5 3"/>
        <path d="m3 9 9-6.5 9 6.5"/>
    </svg>
);


const Sidebar: React.FC<{ currentPage: Page; onNavigate: (page: Page) => void }> = ({ currentPage, onNavigate }) => (
  <aside className="w-64 bg-black text-slate-200 flex flex-col shadow-lg">
    <div className="p-6 border-b border-gray-800 flex flex-col items-center">
      <Logo />
      <h1 className="text-2xl font-bold">My.<span className="text-white">Italchimici</span></h1>
    </div>
    <nav className="flex-grow p-4">
      <ul>
        {NAV_ITEMS.map(item => {
          const Icon = iconMap[item.id];
          const isActive = currentPage === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
                className={`flex items-center px-4 py-3 my-1 rounded-lg transition-colors text-sm font-medium ${isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-800 text-slate-300'}`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  </aside>
);

const Header: React.FC<{ user: User; onLogout: () => void; onNavigate: (page: Page) => void }> = ({ user, onLogout, onNavigate }) => {
  const [isLinksOpen, setIsLinksOpen] = useState(false);
  const linksDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (linksDropdownRef.current && !linksDropdownRef.current.contains(event.target as Node)) {
        setIsLinksOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
  <header className="bg-black shadow-sm p-4 flex justify-between items-center gap-6">
    <div>
        <button 
            onClick={() => onNavigate('admin-news')}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors"
        >
            <SettingsIcon className="w-5 h-5" />
            Admin Panel
        </button>
    </div>
    <div className="flex items-center gap-6">
        <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="w-5 h-5 text-slate-400" />
        </span>
        <input
            type="search"
            placeholder="Cerca nel portale..."
            className="w-64 bg-gray-800 text-slate-200 placeholder-slate-400 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
        />
        </div>

        <div className="flex items-center gap-4">
            <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" title="E-mail" className="text-slate-400 hover:text-white transition-colors">
                <MailIcon className="w-6 h-6" />
            </a>
            <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" title="Calendario" className="text-slate-400 hover:text-white transition-colors">
                <CalendarIcon className="w-6 h-6" />
            </a>
            <a href="https://tasks.google.com/" target="_blank" rel="noopener noreferrer" title="Tasks" className="text-slate-400 hover:text-white transition-colors">
                <TasksIcon className="w-6 h-6" />
            </a>
            <a href="https://chat.google.com/" target="_blank" rel="noopener noreferrer" title="Chat" className="text-slate-400 hover:text-white transition-colors">
                <ChatIcon className="w-6 h-6" />
            </a>
            <div className="relative" ref={linksDropdownRef}>
                <button 
                    onClick={() => setIsLinksOpen(!isLinksOpen)}
                    className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors focus:outline-none p-1 rounded"
                    aria-haspopup="true"
                    aria-expanded={isLinksOpen}
                >
                    <span className="text-sm font-medium">Links</span>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${isLinksOpen ? 'rotate-180' : ''}`} />
                </button>
                {isLinksOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 py-1">
                        <a href="https://mynest.fondoest.it/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-slate-300 hover:bg-gray-700">Welfare</a>
                        <a href="https://assoservizipaghe.aib.bs.it/HRPortal/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-slate-300 hover:bg-gray-700">Paghe</a>
                    </div>
                )}
            </div>
        </div>
        
        <div className="w-px h-8 bg-gray-700"></div>
        
        <div className="flex items-center">
        <div className="text-right mr-4">
            <p className="font-semibold text-sm text-slate-200">{user.name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
        </div>
        <img className="w-10 h-10 rounded-full" src={user.avatarUrl} alt="User Avatar" />
        <button onClick={onLogout} className="ml-6 text-slate-400 hover:text-white transition-colors">
            <LogoutIcon className="w-6 h-6" />
        </button>
        </div>
    </div>
  </header>
  )
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(MOCK_NEWS);

  const markNewsAsRead = useCallback(() => {
    if (!user) return;
    setNewsArticles(prevNews => {
        // Create a deep copy to avoid direct state mutation.
        const newNews = JSON.parse(JSON.stringify(prevNews));
        let changed = false;
        newNews.forEach((article: NewsArticle) => {
            if (!article.readBy.includes(user.email)) {
                article.readBy.push(user.email);
                changed = true;
            }
        });
        return changed ? newNews : prevNews;
    });
  }, [user]);

  const handleNavigation = useCallback((page: Page) => {
    setCurrentPage(page);
    window.location.hash = page;
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as Page;
      const allPages: Page[] = [...NAV_ITEMS.map(i => i.id), 'admin-news'];
      if (allPages.includes(hash)) {
        setCurrentPage(hash);
      } else {
        handleNavigation('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [handleNavigation]);

  useEffect(() => {
    // When the user is on the homepage, mark the news as read.
    if (currentPage === 'home' && user) {
        markNewsAsRead();
    }
  }, [currentPage, user, markNewsAsRead]);


  const handleLogin = () => {
    setUser(MOCK_USER);
    handleNavigation('home');
  };

  const handleLogout = () => {
    setUser(null);
    window.location.hash = '';
  };

  const generateAppContext = (): string => {
    let context = "Ecco un riepilogo delle informazioni attuali dell'azienda:\n\n";

    context += "=== NOTIZIE AZIENDALI ===\n";
    MOCK_NEWS.forEach(news => {
        context += `Titolo: ${news.title}\nData: ${news.date}\nContenuto: ${news.excerpt}\n\n`;
    });

    context += "=== PROCEDURE E QUALITÀ ===\n";
    MOCK_PROCEDURE_DOCS.forEach(doc => {
        context += `Procedura: ${doc.name}\nCategoria: ${doc.category}\nContenuto: ${doc.content}\n\n`;
    });
    
    context += "=== EVENTI DI OGGI IN CALENDARIO ===\n";
    MOCK_CALENDAR_EVENTS.forEach(event => {
        context += `Evento: ${event.title}\nOrario: ${event.time}\nDescrizione: ${event.description}\n\n`;
    });

    context += "=== POST RECENTI SUL FORUM ===\n";
    MOCK_FORUM_POSTS.forEach(post => {
        context += `Titolo Post: ${post.title}\nAutore: ${post.author.name}\nContenuto: ${post.content}\n\n`;
    });

    return context;
  };
  
  const renderPage = () => {
    if (!user) return null;

    switch (currentPage) {
      case 'home':
        return <HomePage user={user} news={newsArticles} />;
      case 'docs':
        return <FilesPage pageTitle="Documenti Google" ownedFiles={MOCK_DOCS_OWNED} sharedFiles={MOCK_DOCS_SHARED} fileType="doc" />;
      case 'sheets':
        return <FilesPage pageTitle="Fogli Google" ownedFiles={MOCK_SHEETS_OWNED} sharedFiles={MOCK_SHEETS_SHARED} fileType="sheet" />;
      case 'procedures':
        return <ProceduresPage />;
      case 'forum':
        return <ForumPage />;
      case 'holidays':
        return <HolidaysPage />;
      case 'admin-news':
        return <NewsAdminPage allNews={newsArticles} onUpdateNews={setNewsArticles} allEmployees={MOCK_EMPLOYEES} />;
      default:
        return <HomePage user={user} news={newsArticles} />;
    }
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigation} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={handleLogout} onNavigate={handleNavigation} />
        <div className="flex-1 overflow-y-auto">
          {renderPage()}
        </div>
      </main>
      <GlobalChat appContext={generateAppContext()} />
    </div>
  );
};

export default App;
