/**
 * Button组件
 * @date 2017-02-14
 */
import React, { PropTypes } from 'react';
import {
    View,
    Image,
    TouchableOpacity
} from 'react-native';

const propTypes = {
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    style: Text.propTypes.style,
    containerStyle: View.propTypes.style,
    source: PropTypes.object,
};

const ImageButton = (props) => {
    const { onPress, disabled, style, containerStyle, source } = props;

    return (
        <TouchableOpacity
            style={containerStyle}
            onPress={onPress}
            disabled={disabled}
        >
            <Image style={style} source={source} />
        </TouchableOpacity>
    )
};

ImageButton.propTypes = propTypes;

ImageButton.defaultProps = {
    onPress() {},
    disabled: false,
};

export default ImageButton;
