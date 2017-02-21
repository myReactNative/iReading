import React, { PropTypes } from 'react';
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
