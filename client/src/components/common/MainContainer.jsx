import { Col, Container, Row } from 'reactstrap';
import React from 'react';

export const MainContainer = ({ children }) => {
    return (
        <section id="login-content" className="login-content">
            <Container>
                <Row>
                    <Col xs="12" lg="4">
                        <div className="form-login">
                            {children}
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};
