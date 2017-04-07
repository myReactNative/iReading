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
import ReadingToolBar from '../components/ReadingToolBar';

const toolbarActions = [
    {
        title: '分享',
        iconName: 'md-share',
        show: 'always'
    }
]

let canGoBack = false;

class WebViewPage extends Component {
    constructor(props) {
        super(props);
        console.log(props);

        this.state = {
            isShareModal: false
        };

        this.onActionSelected = this.onActionSelected.bind(this);
        this.renderSpinner = this.renderSpinner.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    componentDidMount() {
        // Actions.refresh({
        //     title: this.props.article.userName,
        //     renderRightButton: this.renderRightButton.bind(this)
        // });

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
        const { route } = this.props;

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
                    <Text>{route.article.title}</Text>
                </View>

            </TouchableWithoutFeedback>
        )
    }

    render() {
        const { navigator, route } = this.props;
        return (
            <View style={styles.container}>
                <ReadingToolBar 
                    actions={toolbarActions}
                    onActionSelected = {this.onActionSelected}
                    title={route.article.title}
                    navigator={navigator}
                />
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
                    source={{ uri: route.article.url }}
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