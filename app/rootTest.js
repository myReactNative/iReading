import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';
import TimeAgo from 'react-native-timeago';

var timestamp = 1487688728;

export default class RootTest extends Component {
    render() {
        return (
            <TimeAgo time={timestamp} />
        )
    }
}