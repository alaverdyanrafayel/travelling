import React from 'react';

export const InputGroup = ({ icon, input: { value, placeholder, handleChange, handleKeyPress } }) => {
    return (
        <div className="input-group">
            <span className="input-group-addon"><i className={`fa fa-${icon}`}/></span>
            <input
                type="text"
                className="form-control"
                aria-describedby="basic-addon1"
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
            />
        </div>
    );
};
