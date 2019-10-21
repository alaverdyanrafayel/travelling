import React from 'react';
import { Notification } from './Notification';

export class Notifications extends React.Component {

    shouldComponentUpdate(nextProps) {
        return !nextProps.messages.equals(this.props.messages);
    }

    render() {
        const { messages } = this.props;
        
        return (
            messages.size > 0 ? <div>
                {messages.map((notification, index) =>
                    <Notification
                        key={index}
                        type={notification.get('type')}
                        message={notification.get('message')}
                        additionalText={notification.get('additionalText')}/>)}
            </div> : null
        );
    }
}
