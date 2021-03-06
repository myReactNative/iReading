/**
 * Button组件
 * @date 2017-02-14
 */
import React, { PropTypes } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';

const propTypes = {
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    style: Text.propTypes.style,
    containerStyle: View.propTypes.style,
    text: PropTypes.string,
    activeOpacity: PropTypes.number
};

const Button = (props) => {
    const { onPress, disabled, style, containerStyle, text, activeOpacity } = props;

    return (
        <TouchableOpacity
            style={containerStyle}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={activeOpacity}
        >
            <Text style={style}>
                {text}
            </Text>
        </TouchableOpacity>
    )
};

Button.propTypes = propTypes;

Button.defaultProps = {
    onPress() {},
    disabled: false,
    activeOpacity: 0.8
};

export default Button;
