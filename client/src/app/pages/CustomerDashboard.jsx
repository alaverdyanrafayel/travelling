import React from 'react';
import { CustomerDashboardLayout, FriendReferralForm } from 'components/core';


export class CustomerDashboard extends React.Component {
    render() {
        return (
            <CustomerDashboardLayout>
                <div className="panel panel-default dashboard_panel">
                    <div className="panel-heading dashboard_panel_heading">
                        Booking history
                    </div>
                    <div className="panel-body">
                      <table className="table table-condensed dashboard_table">
                          <thead className="dashboard_table_head">
                          <tr>
                              <th className="dashboard_table_cell">Instalment amount</th>
                              <th className="dashboard_table_cell">Next payment date</th>
                              <th className="dashboard_table_cell hidden-xs">Total booking value</th>
                              <th className="dashboard_table_cell hidden-xs">Payment method</th>
                              <th className="dashboard_table_cell hidden-xs">Payments left</th>
                          </tr>
                          </thead>
                          <tbody style={{height: '300px', display: 'block'}}>
                          </tbody>
                        </table>
                    </div>
                  </div>
                  <FriendReferralForm />
            </CustomerDashboardLayout>
        );
    }
}

export default CustomerDashboard;
