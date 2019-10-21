import React from 'react';
import { connect } from 'react-redux';
import { selector } from '../services';
import { LayoutDiv } from 'components/core';

class Layout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { children } = this.props;

        return (
            <LayoutDiv>
                {children}
            </LayoutDiv>
        );
    }
}

const mapStateToProps = state => selector(state);

const mapDispatchToProps = dispatch => {
    return { };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
