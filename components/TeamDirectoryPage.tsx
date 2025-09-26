import React, { useState, useMemo } from 'react';
import type { TeamMember } from '../types';
import { SearchIcon, TeamIcon } from './Icons';

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 text-center flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg">
        <img src={member.avatarUrl} alt={member.name} className="h-24 w-24 rounded-full mb-4" />
        <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
        <p className="text-sm text-blue-600 font-medium">{member.role}</p>
        <p className="text-sm text-gray-500 mt-1">{member.department}</p>
        <div className="mt-4 border-t border-gray-200 w-full pt-4 space-y-1 text-xs text-gray-600">
            <p className="hover:text-blue-600 cursor-pointer">{member.email}</p>
            <p>{member.phone}</p>
        </div>
    </div>
);

export const TeamDirectoryPage: React.FC<{ teamMembers: TeamMember[] }> = ({ teamMembers }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMembers = useMemo(() => {
        if (!searchTerm) return teamMembers;
        const lowercasedFilter = searchTerm.toLowerCase();
        return teamMembers.filter(member =>
            member.name.toLowerCase().includes(lowercasedFilter) ||
            member.role.toLowerCase().includes(lowercasedFilter) ||
            member.department.toLowerCase().includes(lowercasedFilter)
        );
    }, [teamMembers, searchTerm]);

    return (
        <div className="container mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Directory</h1>
            <p className="text-gray-500 mb-8">Find and connect with your colleagues.</p>

            <div className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, role, or department..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-100 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        aria-label="Search team members"
                    />
                </div>
            </div>
            
            {filteredMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredMembers.map(member => (
                        <TeamMemberCard key={member.id} member={member} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                     <TeamIcon className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No colleagues found</h3>
                    <p className="mt-1 text-sm text-gray-500">No results for "{searchTerm}". Try a different search.</p>
                </div>
            )}


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