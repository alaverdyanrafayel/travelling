import React from 'react';
import { Col, Row, Button } from 'reactstrap';
import { FormGroup } from 'components/form-elements/index';

export default class DeclineBooking extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <Row>
                    <Col sm="12" md="4" className="col-md-offset-4">
                        <div className="bordered-box height-400">
                            <Row>
                                <Col sm="12">
                                    <Row>
                                        <p className="manual-decision">Manual Decision Required</p><hr /><br />
                                    </Row>
                                </Col>
                                <Col sm="12">
                                    <Row>
                                        <p className="finalise-rejection">
                                            Unfortunately we were unable to approve your transaction automatically.   
                                        </p><br /><br />
                                    </Row>
                                </Col>
                                <Col sm="6" md="12" className="col-xs-8">
                                    <Row>
                                        <p className="finalise-rejection">
                                            You will be notified by one of our account managers
                                            shortly who will provide you with a manual decision.
                                        </p>
                                    </Row>
                                </Col>
                                <Col sm="12">
                                    <form>
                                        <FormGroup groupClass="row mt-15">
                                            <div className="col-xs-12">
                                                <div className="col-sm-12">
                                                    <Button className="btn-block btnViolet"
                                                            type="submit"
                                                        onClick={this.props.handleDecline} >
                                                        <span>Account Dashboard</span>
                                                    </Button>
                                                </div>
                                            </div>                                                    
                                        </FormGroup>
                                    </form>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}
