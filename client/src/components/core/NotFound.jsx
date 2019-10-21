import React from 'react';
import { Link } from 'react-router';
import { Col } from 'reactstrap';

export const NotFound = () => {
    return (
        <div className="fixed-center">
            <Col xs={12} className="logoWrapper col-xs-12">
                <Link to="/">
                    <img className="img-responsive box-center" src="/img/logo-big.png" alt="logo"/>
                </Link>
            </Col>
            <div className="ui text">
                <h1 className="ui header">
                    Not Found
                </h1>
            </div>
        </div>
    );
};
