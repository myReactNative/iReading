import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Main from '../pages/Main';
import * as readCreators from '../actions/read';

class MainContainer extends Component {
    
    render() {
        console.log("MainContainer");
        return (
            <Main {...this.props} />
        );
    }
}

const mapStateToProps = (state) => {
    const { read } = state;
    return {
        read
    };
};

const mapDispatchToProps = (dispatch) => {
    const readActions = bindActionCreators(readCreators, dispatch);

    return {
        readActions
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);

