
import React from 'react';

export const CodeInput = ({ code, onCodeChange, language, disabled }) => {
    return (
        <div className="flex-grow flex flex-col">
             <label htmlFor="code-input" className="sr-only">Code Input</label>
            <textarea
                id="code-input"
                value={code}
                onChange={(e) => onCodeChange(e.target.value)}
                disabled={disabled}
                placeholder={`Paste your ${language} code here...`}
                className="w-full flex-grow bg-slate-900/70 border border-slate-700 rounded-md p-4 font-mono text-sm text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition duration-200 resize-none"
                rows={20}
            />
        </div>
    );
};
