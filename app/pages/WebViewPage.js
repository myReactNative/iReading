/**
 * WebViewPage
 * @author lifuqiang
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    WebView,
    BackAndroid,
    Modal,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import { toastShort } from '../utils/ToastUtil';
import LoadingView from '../components/LoadingView';

let canGoBack = false;

class WebViewPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShareModal: false
        };

        this.onActionSelected = this.onActionSelected.bind(this);
        this.renderSpinner = this.renderSpinner.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    componentDidMount() {
        Actions.refresh({
            title: this.props.article.userName,
            renderRightButton: this.renderRightButton.bind(this)
        });

        BackAndroid.addEventListener('hardwareBackPress', this.goBack);
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.goBack);
    }

    onActionSelected() {
        this.setState({
            isShareModal: true
        });
    }

    renderRightButton() {
        return (
            <Icon.Button 
                name="md-share"
                backgroundColor="transparent"
                underlayColor="transparent"
                activeOpacity={0.8}
                onPress={this.onActionSelected}
            />
        );
    }

    goBack() {
        if (this.state.isShareModal) {
            this.setState({
                isShareModal: false
            });

            return true;
        } else if (canGoBack) {
            this.webview.goBack();
            return true;
        }

        return false;
    }

    onNavigationStateChange(navState) {
        canGoBack = navState.canGoBack;
    }

    renderLoading() {
        return <LoadingView />;
    }

    renderSpinner() {
        const { article } = this.props;

        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    this.setState({
                        isShareModal: false
                    })
                }}
            >
                <View 
                    key={'spinner'}
                    style={styles.spinner}
                >
                    <Text>{article.title}</Text>
                </View>

            </TouchableWithoutFeedback>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Modal
                    animationType="fade"
                    visible={this.state.isShareModal}
                    transparent
                    onRequestClose={() => {
                        this.setState({
                            isShareModal: false
                        })
                    }}
                >
                    {this.renderSpinner()}
                </Modal>
                <WebView 
                    ref={(ref) => {this.webview = ref;}}
                    automaticallyAdjustContentInsets={false}
                    style={styles.base}
                    source={{ uri: this.props.article.url }}
                    javaScriptEnabled
                    domStorageEnabled
                    startInLoadingState
                    scalesPageToFit
                    decelerationRate="normal"
                    onShouldStartLoadWithRequest={() => {
                        const shouldStartLoad = true;
                        return shouldStartLoad;
                    }}
                    onNavigationStateChange={this.onNavigationStateChange}
                    renderLoading={this.renderLoading}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
    },
    spinner: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.65)'
    },
    base: {
        flex: 1,
    }
});

export default WebViewPage;