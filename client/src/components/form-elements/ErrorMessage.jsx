import React from 'react';

export const ErrorMessage = ({ children }) => {
    return (
        <p className={`error-message ${!children && 'hidden'}`}>
            {children && children.replace(/^"(.*)"$/, '$1')}
        </p>
    );
};
