import React from 'react';

export const HoverTip = ({ children }) => {
    return (
        <span className="fa fa-question-circle-o help-icon-tip" aria-hidden="true">
            <span className="help-content">{children}</span>
        </span>
    );
};

export default HoverTip;
