import React, { PropTypes, Component } from 'react';
import {
    StyleSheet,
    ListView,
    RefreshControl,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    InteractionManager,
    ActivityIndicator,
    RecyclerViewBackedScrollView,
    Image,
    DeviceEventEmitter,
    Platform,
    Dimensions,
    DrawerLayoutAndroid
} from 'react-native';

import DrawerLayout from 'react-native-drawer-layout';
import TimeAgo from 'react-native-timeago';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import ReadingToolBar from '../components/ReadingToolBar';
import LoadingView from '../components/LoadingView';
import About from '../pages/About';
import Feedback from '../pages/Feedback';
import CategoryContainer from '../containers/CategoryContainer';
import WebViewPage from './WebViewPage';
import { toastShort } from '../utils/ToastUtil';
import Storage from '../utils/Storage';

require('moment/locale/zh-cn');

const homeImg = require('../img/home.png');
const categoryImg = require('../img/category.png');
const inspectionImg = require('../img/inspection.png');
const infoImg = require('../img/info.png');

const propTypes = {
    readActions: PropTypes.object,
    read: PropTypes.object.isRequired
};

let canLoadMore;
let page = 1;
let loadMoreTime = 0;

// const contextTypes = {
//     routes: PropTypes.object.isRequired
// };

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

        this.renderItem = this.renderItem.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.renderNavigationView = this.renderNavigationView.bind(this);
        this.onIconClicked = this.onIconClicked.bind(this);
        
        canLoadMore = false;
        
    }

    componentDidMount() {
        const { readActions } = this.props;

        DeviceEventEmitter.addListener('changeCategory', (typeIds) => {
            typeIds.forEach((typeId) => {
                readActions.requestArticleList(false, true, typeId);
            });

            this.setState({
                typeIds
            });
        });

        InteractionManager.runAfterInteractions(() => {
            Storage.get('typeIds')
                .then((typeIds) => {
                    console.log(typeIds);
                    if (! typeIds) {
                        return ;
                    }

                    typeIds.forEach((typeId) => {
                        readActions.requestArticleList(false, true, typeId);
                    });

                    Storage.get('typeList').then(typeList => 
                        this.setState({
                            typeIds, 
                            typeList
                        })
                    );

                });
        });
    }

    componentWillReceiveProps(nextProps) {
        const { read } = this.props;
        if (read.isLoadMore && !nextProps.read.isLoadMore && !nextProps.read.isRefreshing) {
            if (nextProps.read.noMore) {
                toastShort('没有更多数据了');
            }
        }
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners('changeCategory');
    }

    renderItem(article) {
        return (
            <TouchableOpacity onPress={() => this.onPress(article)}>
                <View style={styles.containerItem}>
                    <Image 
                        style={styles.itemImg}
                        source={{ uri: article.contentImg }}
                    />
                    <View style={styles.itemRightContent}>
                        <Text style={styles.title}>
                            {article.title}
                        </Text>
                        <View style={styles.itemRightBottom}>
                            <Text style={styles.userName}>{article.userName}</Text>
                            <TimeAgo style={styles.timeAgo} time={article.date} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    onIconClicked() {
        this.drawer.openDrawer();
    }

    onPress(article) {
        // const { routes } = this.context;
        // console.log(routes);
        // routes.web({article})
        const { navigator } = this.props;
        navigator.push({
            component: WebViewPage, 
            name: 'WebViewPage',
            article
        });
    }

    onRefresh(typeId) {
        const { readActions } = this.props;
        canLoadMore = false;
        readActions.requestArticleList(true, false, typeId);
    }

    onEndReached(typeId) {
        const time = Date.parse(new Date()) / 1000;
        if (canLoadMore && time - loadMoreTime > 1) {
            page += 1;
            const { readActions } = this.props;
            readActions.requestArticleList(false, false, typeId, true, page);
            canLoadMore = false;
            loadMoreTime = Date.parse(new Date()) / 1000;
        }
    }

    onScroll() {
        if (! canLoadMore) {
            canLoadMore = true;
        }
    }

    renderFooter() {
        const { read } = this.props;
        if (read.isLoadMore) {
            return (
                <View style={styles.footerContainer}>
                    <ActivityIndicator size="small" color="#3e9ce9" />
                    <Text style={styles.footerText}>
                        数据加载中...
                    </Text>
                </View>
            );
        }
    }

    renderContent(dataSource, typeId) {
        const { read } = this.props;
        if (read.loading) {
            return <LoadingView />;
        }

        const isEmpty = read.articleList[typeId] === undefined;
        if (isEmpty) {
            return (
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    horizontal={false}
                    contentContainerStyle={styles.no_data}
                    style={styles.base}
                    refreshControl={
                        <RefreshControl 
                            style={styles.refreshControlBase}
                            refreshing={read.isRefreshing}
                            onRefresh={() => this.onRefresh(typeId)}
                            title="Loading..."
                            colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                        />
                    }
                >
                    <View style={{alignItems: 'center'}}>
                        <Text style={{ fontSize: 16}}>
                            目前没有数据，请刷新重试...
                        </Text>
                    </View>
                </ScrollView>
            );
        }

        return (
            <ListView 
                initialListSize={5}
                dataSource={dataSource}
                renderRow={this.renderItem}
                style={styles.listView}
                onEndReached={() => this.onEndReached(typeId)}
                onEndReachedThreshold={10}
                onScroll={this.onScroll}
                renderFooter={this.renderFooter}
                renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                refreshControl = {
                    <RefreshControl 
                        style={styles.refreshControlBase}
                        refreshing={read.isRefreshing}
                        onRefresh={() => this.onRefresh(typeId)}
                        title="Loading..."
                        colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                    />
                }
            />
        );
    }

    onPressDrawerItem(index) {
        const { navigator } = this.props;
        this.drawer.closeDrawer();

        switch (index) {
            case 1:
                navigator.push({
                    component: CategoryContainer, 
                    name: 'Category'
                });
                break;
            case 2:
                navigator.push({
                    component: Feedback, 
                    name: 'Feedback'
                });
                break;
            case 3: 
                navigator.push({
                    component: About, 
                    name: 'About'
                });
                break;
            default:
                break;
        }
    }

    renderNavigationViewItem(icon, title, index) {
        return (
            <TouchableOpacity
                style={styles.drawerContent}
                onPress={() => this.onPressDrawerItem(index)}
            >
                <Image 
                    style={styles.drawerIcon}
                    source={icon}
                />
                <Text style={styles.drawerText}>
                    {title}
                </Text>
            </TouchableOpacity>
        );
    }

    renderNavigationView() {
        return (
            <View style={[styles.container, { backgroundColor: '#fcfcfc' }]}>
                <View style={styles.drawerTitleContent}>
                    <Text style={styles.drawerTitle}>
                        iReading
                    </Text>
                    <Text style={styles.drawerTitle}>
                        让生活更精彩
                    </Text>
                </View>
                {this.renderNavigationViewItem(homeImg, '首页', 0)}
                {this.renderNavigationViewItem(categoryImg, '分类', 1)}
                {this.renderNavigationViewItem(inspectionImg, '建议', 2)}
                {this.renderNavigationViewItem(infoImg, '关于', 3)}
            </View>
        );
    }

    render() {
        const { read, navigator } = this.props;
        return (
            <DrawerLayout
                ref={(ref) => {this.drawer = ref;}}
                drawerWidth={Dimensions.get('window').width / 5 * 3}
                drawerPosition={Platform.OS === 'android' ? DrawerLayoutAndroid.positions.Left : 'left'}
                renderNavigationView={this.renderNavigationView}
            >
                <View style={styles.container}>
                    <ReadingToolBar 
                        title="iReading"
                        navigator={navigator}
                        onIconClicked={this.onIconClicked}
                        navIconName="md-menu"
                    />
                    <ScrollableTabView 
                        renderTabBar={() => 
                            <DefaultTabBar 
                                tabStyle={styles.tab}
                                textStyle={styles.tabText}
                            />
                        }
                        tabBarBackgroundColor='#fcfcfc'
                        tabBarUnderlineStyle={styles.tabBarUnderline}
                        tabBarActiveTextColor='#3e9ce9'
                        tabBarInactiveTextColor='#aaaaaa'
                    >
                        {this.state.typeIds.map((typeId) => {
                            let name = '';
                            if (this.state.typeList === null) {
                                return null;
                            }

                            for (let i = 0, l = this.state.typeList.length; i < l; i++) {
                                if (typeId.toString() === this.state.typeList[i].id) {
                                    name = this.state.typeList[i].name;
                                    break;
                                }
                            }
                            console.log(typeId.toString() + '====' + name);
                            console.log(read.articleList[typeId]);
                            const typeView = (
                                <View
                                    key={typeId}
                                    tabLabel={name}
                                    style={styles.base}
                                >
                                    {this.renderContent(this.state.dataSource.cloneWithRows(
                                        read.articleList[typeId] === undefined ? [] :
                                            read.articleList[typeId]
                                    ), typeId)}
                                </View>
                            );
                            
                            return typeView;
                        })}
                    </ScrollableTabView>
                </View>
            </DrawerLayout>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        //paddingTop: Platform.OS === 'ios' ? 0 : 0
        backgroundColor: '#fff'
    },
    tab: {
        paddingBottom: 0
    },
    tabText: {
        fontSize: 16
    },
    tabBarUnderline: {
        backgroundColor: '#3e9ce9',
        height: 2
    },
    base: {
        flex: 1
    },
    no_data: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100
    },
    refreshControlBase: {
        backgroundColor: 'transparent'
    },
    listView: {
        backgroundColor: '#eeeeec'
    }, 
    containerItem: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fcfcfc',
        padding: 10,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1
    },
    itemImg: {
        width: 88,
        height: 66,
        marginRight: 10
    },
    itemRightContent: {
        flex: 1,
        flexDirection: 'column'
    },
    title: {
        fontSize: 16,
        textAlign: 'left',
        color: 'black'
    },
    itemRightBottom: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    userName: {
        flex: 1,
        fontSize: 14,
        color: '#87cefa',
        marginTop: 5,
        marginRight: 5
    },
    timeAgo: {
        fontSize: 14, 
        color: '#aaaaaa',
        marginTop: 5
    },
    footerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    },
    footerText: {
        textAlign: 'center',
        fontSize: 16,
        marginLeft: 10
    },
    drawerTitleContent: {
        height: 120,
        justifyContent: 'flex-end',
        padding: 20,
        backgroundColor: '#3e9ce9'
    },
    drawerTitle: {
        fontSize: 20,
        textAlign: 'left',
        color: '#fcfcfc'
    },
    drawerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    drawerIcon: {
        width: 30,
        height: 30,
        marginLeft: 5
    },
    drawerText: {
        fontSize: 18,
        marginLeft: 15,
        textAlign: 'center',
        color: 'black'
    }
});

// Main.contextTypes = contextTypes;

export default Main;