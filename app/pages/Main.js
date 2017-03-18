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

let canLoadMore;
let page = 1;
let loadMoreTime = 0;

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

        this.renderItem = this.renderItem.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        
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
        //this.drawer.openDrawer();
    }

    onPress(article) {
        const { routes } = this.context;
        console.log(routes);
        routes.web({article})
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

    render() {
        const { read } = this.props;
        return (
            <View style={styles.container}>
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: Platform.OS === 'ios' ? 10 : 0
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
    }
});

Main.contextTypes = contextTypes;

export default Main;