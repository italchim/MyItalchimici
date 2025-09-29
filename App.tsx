import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { HolidaysPage } from './components/HolidaysPage';
import { DocumentsPage } from './components/DocumentsPage';
import { SpreadsheetsPage } from './components/SpreadsheetsPage';
import { SuggestionsPage } from './components/SuggestionsPage';
import { ForumPage } from './components/ForumPage';
import { PoliciesPage } from './components/PoliciesPage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SearchResultsPage } from './components/SearchResultsPage';
import { TeamDirectoryPage } from './components/TeamDirectoryPage';
import { EmailPage } from './components/EmailPage';
import { TasksPage } from './components/TasksPage';
import { LoginPage } from './components/LoginPage';
import { ApiKeyPage } from './components/ApiKeyPage';
import { SettingsPage } from './components/SettingsPage';
import type { DashboardData, View, SearchResult, TeamMember, PolicyDocument, Task, UserSettings } from './types';
import { DocumentType } from './types';
import { generateDashboardContent, performSearch, generateTeamDirectory } from './services/geminiService';

type AppState = 'login' | 'needs_api_key' | 'loading' | 'ready' | 'error';

const watermarkStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='272' height='272' xmlns='http://www.w3.org/2000/svg'%3E%3Cimage href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARAAAAEQCAYAAABPfx33AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIQSURBVGhD7ZpBDsIgDEVx/0s72F6eRxwYgtFGnE6r0D62Y4yEl3++fF4A/L2y+T0wCLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRLgIRL' /-=-" width-=-" width='272' height='272' opacity='0.03' /%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center',
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('login');
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('dashboard');

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);

  const [teamMembers, setTeamMembers] = useState<TeamMember[] | null>(null);
  const [loadingTeam, setLoadingTeam] = useState<boolean>(false);

  const [userSettings, setUserSettings] = useState<UserSettings>({
      name: 'Alex Chen',
      avatarUrl: 'https://picsum.photos/100/100',
  });

  useEffect(() => {
    try {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            setUserSettings(JSON.parse(savedSettings));
        }
    } catch (e) {
        console.error("Failed to parse user settings from localStorage", e);
    }
  }, []);

  useEffect(() => {
    if (appState !== 'ready') return;

    const fetchTeamData = async () => {
        if (activeView === 'team' && !teamMembers) {
            try {
                setLoadingTeam(true);
                setError(null);
                const members = await generateTeamDirectory();
                setTeamMembers(members);
            } catch (err) {
                 if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred while fetching team data.");
                }
                console.error(err);
            } finally {
                setLoadingTeam(false);
            }
        }
    };
    fetchTeamData();
  }, [activeView, teamMembers, appState]);


  const handleSearch = async (query: string) => {
    if (!query.trim() || !data) return;

    try {
        setIsSearching(true);
        setError(null);
        setSearchQuery(query);
        const results = await performSearch(query, data);
        setSearchResults(results);
        setActiveView('search');
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred during search.");
        }
        console.error(err);
    } finally {
        setIsSearching(false);
    }
  };

  const handleUpdatePolicies = (newPolicies: PolicyDocument[]) => {
      setData(currentData => {
          if (!currentData) return null;
          return { ...currentData, policyDocuments: newPolicies };
      });
  };

  const handleUpdateTasks = (newTasks: Task[]) => {
      setData(currentData => {
          if (!currentData) return null;
          return { ...currentData, tasks: newTasks };
      });
  };

  const handleSettingsUpdate = (newSettings: UserSettings) => {
    setUserSettings(newSettings);
    try {
        localStorage.setItem('userSettings', JSON.stringify(newSettings));
    } catch (e) {
        console.error("Failed to save user settings to localStorage", e);
    }
  };
  
  const handleLoginSuccess = () => {
      setAppState('needs_api_key');
  };

  const handleApiKeySubmit = async (apiKey: string) => {
    sessionStorage.setItem('gemini_api_key', apiKey);
    setAppState('loading');
    setError(null);
    try {
        const dashboardData = await generateDashboardContent();
        setData(dashboardData);
        setAppState('ready');
    } catch (err) {
        sessionStorage.removeItem('gemini_api_key'); // Clear key on failure
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred.");
        }
        setAppState('error');
        console.error(err);
    }
  };


  const handleLogout = () => {
      sessionStorage.removeItem('gemini_api_key');
      setAppState('login');
      setData(null);
      setTeamMembers(null);
      setActiveView('dashboard');
  }

  const renderAppContent = () => {
    if (isSearching || loadingTeam) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 font-medium">
                        {isSearching ? `Searching for "${searchQuery}"...` : 'Loading Team Directory...'}
                    </p>
                </div>
            </div>
        );
    }

    if (data) {
      switch (activeView) {
        case 'dashboard':
          return <Dashboard data={data} setActiveView={setActiveView} userName={userSettings.name} />;
        case 'holidays':
          return <HolidaysPage initialRequests={data.holidayRequests} />;
        case 'documents':
            return <DocumentsPage documents={data.documents.filter(d => d.type === DocumentType.DOCS)} />;
        case 'spreadsheets':
            return <SpreadsheetsPage documents={data.documents.filter(d => d.type === DocumentType.SHEETS)} />;
        case 'suggestions':
            return <SuggestionsPage initialSuggestions={data.suggestions} />;
        case 'forum':
            return <ForumPage initialThreads={data.forumThreads} />;
        case 'policies':
            return <PoliciesPage policies={data.policyDocuments || []} onPoliciesUpdate={handleUpdatePolicies} />;
        case 'team':
            return <TeamDirectoryPage teamMembers={teamMembers || []} />;
        case 'email':
            return <EmailPage emails={data.emails} />;
        case 'tasks':
            return <TasksPage initialTasks={data.tasks || []} onTasksUpdate={handleUpdateTasks} />;
        case 'search':
            return <SearchResultsPage query={searchQuery} results={searchResults} setActiveView={setActiveView} />;
        case 'settings':
            return <SettingsPage currentSettings={userSettings} onSettingsUpdate={handleSettingsUpdate} />;
        default:
          return <Dashboard data={data} setActiveView={setActiveView} userName={userSettings.name} />;
      }
    }
    return null;
  };

  if (appState === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }
  
  if (appState === 'needs_api_key') {
      return <ApiKeyPage onSubmit={handleApiKeySubmit} />;
  }

  if (appState === 'loading') {
    return <div className="flex h-screen w-full justify-center items-center bg-gray-100"><LoadingSpinner /></div>;
  }

  if (appState === 'error') {
     return (
        <div className="flex h-screen w-full justify-center items-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                <h2 className="text-xl font-bold text-red-600 mb-2">An Error Occurred</h2>
                <p className="text-red-700 mb-4">{error || "Failed to initialize the application."}</p>
                <p className="text-sm text-gray-500 mb-6">This could be due to an invalid API key or a network issue. Please check your key and try again.</p>
                <button 
                    onClick={() => setAppState('needs_api_key')}
                    className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Try Again
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex flex-col flex-1 overflow-hidden bg-black">
        <Header onSearch={handleSearch} onLogout={handleLogout} activeView={activeView} userName={userSettings.name} userAvatarUrl={userSettings.avatarUrl} />
        <main 
          className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8 rounded-tl-2xl"
          style={watermarkStyle}
        >
          {renderAppContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
