
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { LanguageSelector } from './components/LanguageSelector';
import { CodeInput } from './components/CodeInput';
import { ReviewOutput } from './components/ReviewOutput';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { reviewCode } from './services/geminiService';
import { LANGUAGES } from './constants';
import { AudioPlayer } from './components/AudioPlayer';

const App = () => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState(LANGUAGES[0].value);
    const [review, setReview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleReview = useCallback(async () => {
        if (!code.trim()) {
            setError('Please enter some code to review.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setReview('');

        try {
            const result = await reviewCode(code, language);
            setReview(result);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [code, language]);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
            <Header />
            <main className="container mx-auto p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="flex flex-col gap-4 bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700">
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <LanguageSelector
                                selectedLanguage={language}
                                onLanguageChange={setLanguage}
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleReview}
                                disabled={isLoading || !code}
                                className="w-full sm:w-auto flex-shrink-0 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
                            >
                                {isLoading ? 'Reviewing...' : 'Review Code'}
                            </button>
                        </div>
                        <CodeInput
                            code={code}
                            onCodeChange={setCode}
                            language={language}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Output Section */}
                    <div className="bg-slate-800/50 rounded-lg shadow-lg border border-slate-700 flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-slate-700">
                             <h2 className="text-lg font-semibold text-slate-200">Review Feedback</h2>
                             {review && !isLoading && !error && <AudioPlayer text={review} />}
                        </div>

                        <div className="relative p-6 flex-grow min-h-[calc(60vh-70px)]">
                             {isLoading && (
                                <div className="absolute inset-0 bg-slate-800/80 flex flex-col justify-center items-center rounded-b-lg z-10">
                                    <Loader />
                                    <p className="mt-4 text-lg text-slate-300">Gemini is thinking...</p>
                                </div>
                            )}
                            {error && <ErrorDisplay message={error} />}
                            <ReviewOutput markdownContent={review} />
                            {!isLoading && !error && !review && (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    <h3 className="text-xl font-semibold">Code Review Awaits</h3>
                                    <p className="mt-2 max-w-sm">Your code review feedback will appear here once you submit your code.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
