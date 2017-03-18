/**
 * Toast工具
 */
import {
    Alert,
    ToastAndroid,
    Platform
} from 'react-native';

export const toastShort = (content, isAlert) => {
    if (isAlert || Platform.OS === 'ios') {
        Alert.alert(
            '提示',
            content.toString()
        );
    } else {
        ToastAndroid.show(content.toString(), ToastAndroid.SHORT);
    }
};

export const toastLong = (content, isAlert) => {
    if (isAlert || Platform.OS === 'ios') {
        Alert.alert(
            '提示',
            content.toString()
        );
    } else {
        ToastAndroid.show(content.toString(), ToastAndroid.toastLong);
    }
};
