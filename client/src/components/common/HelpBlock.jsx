import React from 'react';

export const HelpBlock = ({ children, small, aClass }) => {
    const additionalClass = aClass || '';

    return (
        small ?
            <small className={`help-block ${additionalClass}`}>{children}</small> :
            <span className={`help-block ${additionalClass}`}>{children}</span>
    );
};
