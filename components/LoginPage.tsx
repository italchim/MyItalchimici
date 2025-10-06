import React from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

const GoogleIcon = () => (
  <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.582-3.344-11.227-7.962l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C41.383 36.336 44 31.023 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
  </svg>
);

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg text-center">
        <div>
           <h1 className="text-3xl font-bold text-slate-800">
            Italchimici
            <span className="text-slate-600">Portal</span>
          </h1>
          <p className="mt-2 text-slate-600">Accedi per visualizzare la tua dashboard aziendale.</p>
        </div>
        <button
          onClick={onLogin}
          className="w-full inline-flex items-center justify-center px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200"
        >
          <GoogleIcon />
          Accedi con Google Workspace
        </button>
        <p className="text-xs text-slate-500">
          L'accesso è limitato ai dipendenti autorizzati con un account @italchimici.it valido.
        </p>
      </div>
    </div>
  );
};