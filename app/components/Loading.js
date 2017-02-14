/**
 * Loading加载组件
 */
import React , { PropTypes }from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Text,
    Modal,
    ActivityIndicator
} from 'react-native';

const SIZES = ['small', 'large'];

const propTypes = {
    visible: PropTypes.bool,
    color: PropTypes.string,
    size: PropTypes.oneOf(SIZES),
    overlayColor: PropTypes.string,
    onRequestClose: PropTypes.func
};
