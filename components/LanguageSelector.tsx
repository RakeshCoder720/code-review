
import React from 'react';
import { LANGUAGES } from '../constants';

export const LanguageSelector = ({ selectedLanguage, onLanguageChange, disabled }) => {
    return (
        <div className="w-full sm:w-auto">
            <label htmlFor="language-select" className="sr-only">Select Language</label>
            <select
                id="language-select"
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                disabled={disabled}
                className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-md focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 transition duration-200"
            >
                {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                        {lang.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
