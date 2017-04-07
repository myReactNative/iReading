import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    Linking,
    View
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../components/Button';
import ReadingToolBar from '../components/ReadingToolBar';

const API_STORE = 'https://www.showapi.com/';
const READING_REPO = 'https://github.com/myReactNative/iReading';

const aboutLogo = require('../img/about_logo.png');


class About extends Component {
    
    onPress(url) {
        Linking.openURL(url);
    }

    render() {
        const { navigator } = this.props;
        return (
            <View style={styles.container}>
                <ReadingToolBar 
                    title="关于我们"
                    navigator={navigator}
                />
                <View style={styles.content}>
                    <View style={styles.center}>
                        <Image 
                            style={styles.logo}
                            source={aboutLogo}
                        />
                        <Text style={styles.version}>
                            v1.0
                        </Text>
                        <Text style={styles.title}>
                            iReading
                        </Text>
                        <Text style={styles.subtitle}>
                            让生活更精彩
                        </Text>
                    </View>
                    <View style={styles.bottomContainer}>
                        <View style={styles.disclaimerContent}>
                            <Text style={[styles.disclaimer, {color: '#999999'}]}>
                                免责声明：所有内容均来自：
                            </Text>
                            <Button
                                style={[styles.disclaimer, {color: '#3e9ce9'}]}
                                text={API_STORE}
                                onPress={() => this.onPress(API_STORE)}
                             />
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 10
    },
    center: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        width: 110,
        height: 110,
        marginTop: 50
    },
    version: {
        fontSize: 16,
        textAlign: 'center',
        color: '#aaaaaa',
        marginTop: 5
    },
    title: {
        fontSize: 28,
        textAlign: 'center',
        color: '#313131',
        marginTop: 10,
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        color: '#4e4e4e',
    },
    bottomContainer: {
        alignItems: 'center'
    },
    disclaimerContent: {
        fontSize: 14, 
        textAlign: 'center',
    },
    disclaimer: {

    }
});


export default About;