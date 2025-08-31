
import React from 'react';

export const Header = () => {
    return (
        <header className="bg-slate-900/50 border-b border-slate-700 shadow-md">
            <div className="container mx-auto px-4 py-4 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
                    Gemini Code Reviewer
                </h1>
                <p className="text-slate-400 mt-1">
                    Your AI partner for writing better, cleaner code.
                </p>
            </div>
        </header>
    );
};
