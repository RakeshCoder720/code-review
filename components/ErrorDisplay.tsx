
import React from 'react';

export const ErrorDisplay = ({ message }) => {
    return (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{message}</span>
        </div>
    );
};
