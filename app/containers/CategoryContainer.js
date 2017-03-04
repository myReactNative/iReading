/**
 * 分类
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as categoryCreators from '../actions/category';
import Category from '../pages/Category';

class CategoryContainer extends Component {
    render() {
        return (
            <Category {...this.props} />
        );
    }
}

const mapStateToProps = (state) => {
    const { category } = state;
    return {
        category
    };
};

const mapDispatchToProps = (dispatch) => {
    const categoryActions = bindActionCreators(categoryCreators, dispatch);
    return {
        categoryActions
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryContainer);