import React from 'react';

export const FormGroup = ({ children, has, groupClass }) => {
    let groupExtraClass = groupClass ? groupClass : '';

    return (
        <div className={`form-group ${groupExtraClass} ${has ? ('has-' + has) : ''}`}>
            {children}
        </div>
    );
};

export default FormGroup;
