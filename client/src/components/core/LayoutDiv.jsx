import React from 'react';

export const LayoutDiv = ({ children, idName, style }) => {
    return (
        <div id={idName || '' } style={style || {}}>
            {children}
        </div>
    );
};
