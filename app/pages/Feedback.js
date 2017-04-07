/**
 * 用户回馈
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    Keyboard
} from 'react-native';

import AV from 'leancloud-storage';
import { Actions } from 'react-native-router-flux';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons';
import { toastShort } from '../utils/ToastUtil';
import ReadingToolBar from '../components/ReadingToolBar';

const toolbarActions = [
    {
        title: '提交',
        iconName: 'md-checkmark',
        show: 'always'
    }
];

let feedbackText;

class Feedback extends Component {
    constructor(props) {
        super(props);

        this.onActionSelected = this.onActionSelected.bind(this);
    }

    componentDidMount() {
        feedbackText = '';

        // Actions.refresh({ renderRightButton: this.renderRightButton.bind(this)});
    }

    onActionSelected() {
        if (feedbackText === undefined || feedbackText.replace(/\s+/g, '') === '') {
            toastShort('请填写建议内容哦～');
        } else {
            const { navigator } = this.props;
            const feedback = AV.Object.new('Feedback');
            feedback.set('manufacturer', DeviceInfo.getManufacturer());
            feedback.set('system', DeviceInfo.getSystemName());
            feedback.set('deviceVersion', DeviceInfo.getSystemVersion());
            feedback.set('deviceModel', DeviceInfo.getModel());
            feedback.set('appVersion', DeviceInfo.getVersion());
            feedback.set('feedback', feedbackText);
            feedback.save();

            toastShort('您的问题已反馈，我们会及时跟进处理');
            this.textInput.clear();
            Keyboard.dismiss();

            navigator.pop();
        }
    }

    /*renderRightButton() {
        return (
            <Icon.Button 
                name="md-checkmark"
                backgroundColor="transparent"
                underlayColor="transparent"
                activeOpacity={0.8}
                onPress={this.onActionSelected}
            />
        )
    }*/

    render() {
        const { navigator } = this.props;
        return (
            <View style={styles.container}>
                <ReadingToolBar 
                    title="建议"
                    actions={toolbarActions}
                    onActionSelected={this.onActionSelected}
                    navigator={navigator}
                />
                <TextInput 
                    ref = {(ref) => {this.textInput = ref;}}
                    style={styles.textInput}
                    placeholder="请写下您宝贵的意见"
                    placeholderTextColor="#aaaaaa"
                    underlineColorAndroid="transparent"
                    numberOfLines={200}
                    multiline
                    autoFocus
                    onChangeText = {(text) => {
                        feedbackText = text;
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    textInput: {
        flex: 1,
        fontSize:18,
        padding: 15,
        textAlignVertical: 'top'
    }
});

export default Feedback;
