import React from 'react';

export const FormIcon = ({ type }) => {
    return (
        <i className={`fa fa-exclamation-circle ${type ? (type + '-icon') : 'hidden'}`} aria-hidden="true"/>
    );
};
