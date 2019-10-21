import React from 'react';

export const TextCenter = ({ children, aClass, style = {} }) => {
    const additionalClass = aClass || '';

    return (
        <div className={`text-center ${additionalClass}`} style={style}>
            {children}
        </div>
    );
};
