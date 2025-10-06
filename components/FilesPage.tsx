import React from 'react';
import type { GoogleFile } from '../types';
import { DocsIcon, SheetsIcon } from './Icons';

interface FilesPageProps {
  ownedFiles: GoogleFile[];
  sharedFiles: GoogleFile[];
  pageTitle: string;
  fileType: 'doc' | 'sheet';
}

const FileTable: React.FC<{title: string, files: GoogleFile[], fileType: 'doc' | 'sheet'}> = ({ title, files, fileType }) => {
    const FileIcon = fileType === 'doc' ? DocsIcon : SheetsIcon;
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">{title}</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nome</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Proprietario</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ultima Modifica</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {files.map(file => (
                            <tr key={file.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <FileIcon className={`h-5 w-5 ${fileType === 'doc' ? 'text-blue-500' : 'text-green-500'}`} />
                                        <a href={file.url} className="ml-4 text-sm font-medium text-slate-900 hover:text-slate-600">{file.name}</a>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{file.owner}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{file.lastModified}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const FilesPage: React.FC<FilesPageProps> = ({ ownedFiles, sharedFiles, pageTitle, fileType }) => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">{pageTitle}</h1>
      <div className="space-y-8">
        <FileTable title="Creati da te" files={ownedFiles} fileType={fileType} />
        <FileTable title="Condivisi con te" files={sharedFiles} fileType={fileType} />
      </div>
    </div>
  );
};