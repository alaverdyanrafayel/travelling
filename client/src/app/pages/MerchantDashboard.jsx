import React from 'react';
import { MerchantDashboardLayout, BookingForm } from 'components/core';

export class MerchantDashboard extends React.Component {

    render() {

        return (
            <MerchantDashboardLayout>
                <h2 className="panel-title f-color_purple">NEW BOOKING</h2>
                <BookingForm/>
            </MerchantDashboardLayout>
        );
    }
}

export default MerchantDashboard;
