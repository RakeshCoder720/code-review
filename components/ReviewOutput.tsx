import React, { useEffect, useState } from 'react';

// Fix: Add a global type declaration for `window.marked` to resolve TypeScript compilation errors.
declare global {
    interface Window {
        marked: {
            parse: (markdown: string) => string;
        };
    }
}

export const ReviewOutput = ({ markdownContent }) => {
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        if (markdownContent && window.marked) {
            // Use 'marked' to parse the markdown string into an HTML string
            const parsedHtml = window.marked.parse(markdownContent);
            setHtmlContent(parsedHtml);
        } else {
            setHtmlContent('');
        }
    }, [markdownContent]);
    
    if (!htmlContent) return null;

    return (
        <div className="h-full overflow-y-auto">
            <article
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </div>
    );
};