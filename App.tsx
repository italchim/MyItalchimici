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
import type { DashboardData, View, SearchResult, TeamMember } from './types';
import { DocumentType } from './types';
import { generateDashboardContent, performSearch, generateTeamDirectory } from './services/geminiService';

const App: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('dashboard');

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);

  const [teamMembers, setTeamMembers] = useState<TeamMember[] | null>(null);
  const [loadingTeam, setLoadingTeam] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const dashboardData = await generateDashboardContent();
        setData(dashboardData);
      } catch (err) {
        if (err instanceof Error) {
            setError(`Failed to fetch dashboard content: ${err.message}. Please ensure your API key is configured correctly.`);
        } else {
            setError("An unknown error occurred.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchTeamData = async () => {
        if (activeView === 'team' && !teamMembers) {
            try {
                setLoadingTeam(true);
                setError(null);
                const members = await generateTeamDirectory();
                setTeamMembers(members);
            } catch (err) {
                 if (err instanceof Error) {
                    setError(`Failed to fetch team directory: ${err.message}.`);
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
  }, [activeView, teamMembers]);


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
            setError(`Search failed: ${err.message}.`);
        } else {
            setError("An unknown error occurred during search.");
        }
        console.error(err);
    } finally {
        setIsSearching(false);
    }
  };

  const renderContent = () => {
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

    if (loading) {
      return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
    }
    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-center" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      );
    }
    if (data) {
      switch (activeView) {
        case 'dashboard':
          return <Dashboard data={data} setActiveView={setActiveView} />;
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
            return <PoliciesPage policies={data.policyDocuments || []} />;
        case 'team':
            return <TeamDirectoryPage teamMembers={teamMembers || []} />;
        case 'email':
            return <EmailPage emails={data.emails} />;
        case 'search':
            return <SearchResultsPage query={searchQuery} results={searchResults} setActiveView={setActiveView} />;
        default:
          return <Dashboard data={data} setActiveView={setActiveView} />;
      }
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onSearch={handleSearch} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;