
import React, { useState, useEffect, useRef } from 'react';

const SpeakerWaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

const StopIcon = () => (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 6h12v12H6z" />
    </svg>
);

export const AudioPlayer = ({ text }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const utteranceRef = useRef(null);

    // This effect ensures that if the text content changes or the component unmounts,
    // any ongoing speech is stopped cleanly.
    useEffect(() => {
        return () => {
            const synth = window.speechSynthesis;
            if (synth && synth.speaking) {
                synth.cancel();
            }
        };
    }, [text]);
    
    // This effect is a workaround for a common browser bug where long speech can be
    // cut off silently. It periodically "pings" the speech synthesis engine to keep it active.
    useEffect(() => {
        let intervalId = null;
        if (isSpeaking) {
            intervalId = window.setInterval(() => {
                const synth = window.speechSynthesis;
                if (synth.speaking) {
                    synth.pause();
                    synth.resume();
                } else {
                    // Speech has ended unexpectedly, so we correct the state.
                    setIsSpeaking(false);
                }
            }, 10000); // Ping every 10 seconds
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isSpeaking]);


    const handleToggleAudio = () => {
        const synth = window.speechSynthesis;
        if (!synth) return; // Speech synthesis is not supported

        // If currently speaking, stop it.
        if (isSpeaking) {
            synth.cancel(); // This will trigger the 'onend' event for the utterance.
        } else {
            // If not speaking, start it.
            if (synth.speaking) {
                // This is a safeguard to cancel any speech that might be "stuck".
                synth.cancel();
            }
            
            // Clean the text to improve speech flow and remove non-verbal content.
            const cleanText = text
                .replace(/```[\s\S]*?```/g, 'Code block. ') // Replace code blocks
                .replace(/`/g, '') // Remove backticks for cleaner speech
                .replace(/(\r\n|\n|\r)/gm, " "); // Replace newlines with spaces

            const newUtterance = new SpeechSynthesisUtterance(cleanText);
            
            // Set rate and pitch from state
            newUtterance.rate = rate;
            newUtterance.pitch = pitch;

            utteranceRef.current = newUtterance;
            
            newUtterance.onstart = () => {
                setIsSpeaking(true);
            };

            // Clean up state when speech ends naturally.
            newUtterance.onend = () => {
                setIsSpeaking(false);
                utteranceRef.current = null;
            };

            // Handle and log any errors, then clean up state.
            newUtterance.onerror = (event) => {
                // The "canceled" and "interrupted" errors are expected when we intentionally stop the speech.
                // We don't need to log them as console errors.
                if (event.error !== 'canceled' && event.error !== 'interrupted') {
                    console.error(`SpeechSynthesis Error: ${event.error}`, event);
                }
                setIsSpeaking(false);
                utteranceRef.current = null;
            };

            synth.speak(newUtterance);
        }
    };
    
    // Don't render the button if there's no text or the browser doesn't support speech synthesis.
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) {
        return null;
    }

    return (
        <div className="flex items-center gap-x-4">
            <button
                onClick={handleToggleAudio}
                className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                    isSpeaking
                        ? 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-400'
                        : 'bg-teal-600 hover:bg-teal-500 text-white focus:ring-teal-400'
                }`}
                aria-label={isSpeaking ? 'Stop reading review' : 'Read review aloud'}
            >
                {isSpeaking ? <StopIcon /> : <SpeakerWaveIcon />}
                {isSpeaking ? 'Stop' : 'Read Aloud'}
            </button>
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-2">
                    <label htmlFor="rate-slider" className="text-sm font-medium text-slate-400 w-12">Rate:</label>
                    <input
                        id="rate-slider"
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value))}
                        disabled={isSpeaking}
                        className="w-24 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-xs font-mono w-8 text-center text-slate-300">{rate.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-x-2">
                    <label htmlFor="pitch-slider" className="text-sm font-medium text-slate-400 w-12">Pitch:</label>
                    <input
                        id="pitch-slider"
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={pitch}
                        onChange={(e) => setPitch(parseFloat(e.target.value))}
                        disabled={isSpeaking}
                        className="w-24 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-xs font-mono w-8 text-center text-slate-300">{pitch.toFixed(1)}</span>
                </div>
            </div>
        </div>
    );
};
