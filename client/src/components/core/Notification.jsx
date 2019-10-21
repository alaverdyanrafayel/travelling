import React from 'react';
import { NOTIFICATION_TYPES } from 'configs/constants';

export const Notification = ({ type, message, additionalText }) => {
    if (!message || !type || !NOTIFICATION_TYPES.includes(type)) {
        return null;
    }

    return (
        <div>
            <label className={`label notification label-${type}`} dangerouslySetInnerHTML={{ __html: message }}>
            </label>
            <label className='additional_text' >
                {additionalText}
            </label>
        </div>
    );
};
