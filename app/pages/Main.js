import React, { PropTypes, Component } from 'react';
import {
    StyleSheet,
    ListView,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    InteractionManager,
    ActivityIndicator,
    RecyclerViewBackedScrollView,
    Image,
    DeviceEventEmitter,
    Platform
} from 'react-native';

import TimeAgo from 'react-native-timeago';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import LoadingView from '../components/LoadingView';
import { toastShort } from '../utils/ToastUtil';
import Storage from '../utils/Storage';

require('moment/locale/zh-cn');

const propTypes = {
    readActions: PropTypes.object,
    read: PropTypes.object.isRequired
};

const contextTypes = {
    routes: PropTypes.object.isRequired
};

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            typeIds: [],
            typeList: {}
        };

        
    }

    render() {
        const { read } = this.props;
    }
}