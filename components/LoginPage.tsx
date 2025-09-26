import React from 'react';
import { LogoIcon, GoogleIcon } from './Icons';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-xl shadow-lg m-4">
                <div className="flex flex-col items-center">
                    <LogoIcon className="h-12 w-12 text-gray-800" />
                    <h1 className="mt-4 text-2xl font-bold text-center text-gray-900">
                        MyItalchimici Intra
                    </h1>
                    <p className="mt-4 text-sm text-gray-500">Sign in with your corporate account</p>
                </div>
                
                <div>
                    <button
                        type="button"
                        onClick={onLoginSuccess}
                        className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <GoogleIcon className="h-5 w-5 mr-3" />
                        Sign in with Google
                    </button>
                </div>

                 <div className="text-center">
                    <p className="text-xs text-gray-400">
                        Only authorized members of the Italchimici Google Workspace domain can access this portal.
                    </p>
                </div>
            </div>
        </div>
    );
};