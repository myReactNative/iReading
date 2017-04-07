/**
 * 分类
 */
import React, { Component, PropTypes } from 'react';
import {
    InteractionManager,
    StyleSheet,
    View,
    Text,
    DeviceEventEmitter,
    ScrollView,
    RefreshControl,
    Alert
} from 'react-native';

import AV from 'leancloud-storage';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import Storage from '../utils/Storage';
import GridView from '../components/GridView';
import Button from '../components/Button';
import ReadingToolBar from '../components/ReadingToolBar';
import { toastShort } from '../utils/ToastUtil';

const toolbarActions = [
    {
        title: '提交',
        iconName: 'md-checkmark',
        show: 'always'
    }
];

let tempTypeIds = [];
let maxCategory = 5;  //默认最多5个类别，远端可配置

const propTypes = {
    categoryActions: PropTypes.object,
    category: PropTypes.object.isRequired
};

// const contextTypes = {
//     routes: PropTypes.object.isRequired
// };

class Category extends Component {

    constructor(props) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
        this.onActionSelected = this.onActionSelected.bind(this);
        this.resetRoute = this.resetRoute.bind(this);
        this.onRefresh = this.onRefresh.bind(this);

        this.state = {
            typeIds: tempTypeIds
        };
    }

    componentWillMount() {
        if (! this.props.isFirst) {
            InteractionManager.runAfterInteractions(() => {
                Storage.get('typeIds')
                    .then((typeIds) => {
                        tempTypeIds = typeIds;
                        this.setState({
                            typeIds
                        });
                    });
            });
        }
    }

    componentDidMount() {
        // if (! this.props.isFirst) {
        //     Actions.refresh({ renderRightButton: this.renderRightButton.bind(this)});
        // }

        const { categoryActions } = this.props;
        categoryActions.requestTypeList();
        // const query = new AV.Query('Reading_Settings');
        // query.get('').then((settings) => {
        //     maxCategory = settings.get('max_category');
        // });
    }

    onRefresh() {
        const { categoryActions } = this.props;
        categoryActions.requestTypeList();
    }

    /**
     * 选择事件
     * @param object type 
     */
    onPress(type) {
        const pos = tempTypeIds.indexOf(parseInt(type.id));
        if (pos === -1) {
            tempTypeIds.push(parseInt(type.id));
        } else {
            tempTypeIds.splice(pos, 1);
        }

        this.setState({
            typeIds: tempTypeIds
        });
    }

    /**
     * 选择类别事件
     */
    onSelectCategory() {
        // const { routes } = this.context;
        const { navigator } = this.props;
        if (this.state.typeIds.length === 0) {
            Alert.alert(
                '提示',
                '您确定不选择任何分类吗?',
                [
                    { text: '取消', style: 'cancel'},
                    {
                        text: '确定',
                        onPress: () => {
                            Storage.save('typeIds', this.state.typeIds);
                            // routes.tabbar();
                            navigator.replace({
                                component: MainContainer,
                                name: 'Main'
                            });
                        }
                    },
                ]
            );
        } else {
            Storage.save('typeIds', this.state.typeIds);
            Storage.save('isInit', true);
            // routes.tabbar();
            navigator.replace({
                component: MainContainer,
                name: 'Main'
            });
        }
    }

    /**
     * 选择类别事件
     */
    onActionSelected() {
        if (tempTypeIds.length > maxCategory) {
            toastShort(`不要超过${maxCategory}个类别哦`);
            return;
        }

        if (tempTypeIds.length < 1) {
            toastShort('不要少于1个类别哦');
            return;
        }

        const { routes } = this.context;
        InteractionManager.runAfterInteractions(() => {
            Storage.get('typeIds')
                .then((typeIds) => {
                    if (typeIds.sort().toString() ===  Array.from(tempTypeIds).sort().toString()) {
                        routes.main();
                        return;
                    }
                    Storage.save('typeIds', this.state.typeIds)
                        .then(this.resetRoute);
                });
        });
    }

    resetRoute() {
        // const { routes } = this.context;
        const { navigator } = this.props;
        DeviceEventEmitter.emit('changeCategory', this.state.typeIds);
        // routes.main();
        navigator.pop();
    }

    renderRightButton() {
        return (
            <Icon.Button 
                name="md-checkmark"
                backgroundColor="transparent"
                underlayColor="transparent"
                activeOpacity={0.8}
                onPress={this.onActionSelected}
            />
        );
    }

    renderItem(item) {
        const isSelect = Array.from(this.state.typeIds).indexOf(parseInt(item.id)) !== -1;
        return (
            <Button 
                key={item.id}
                containerStyle={[styles.categoryBtn, isSelect ? { backgroundColor: '#3e9ce9' } : { backgroundColor: '#fcfcfc' }]}
                style={[styles.categoryText, isSelect ? { color: '#fcfcfc' } : { color: 'black' }]}
                text={item.name}
                onPress={() => this.onPress(item)}
            />
        );
    }

    renderGridView() {
        const { category } = this.props;
        return (
            <ScrollView
                automaticallyAdjustContentInsets={false}
                horizontal={false}
                contentContainerStyle={styles.no_data}
                style={styles.base}
                refreshControl={
                    <RefreshControl 
                        refreshing={category.loading}
                        onRefresh={this.onRefresh}
                        title="Loading..."
                        colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                    />
                }
            >
                <View style={styles.gridLayout}>
                    <GridView 
                        items={Array.from(category.typeList)}
                        itemsPerRow={3}
                        renderItem={this.renderItem}
                    />
                </View>
            </ScrollView>
        );
    }

    render() {
        const { navigator , route } = this.props;
        if (this.props.isFirst) {
            return (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={[styles.btnText, { color: 'black', padding: 5, fontSize: 18 }]}>
                            初次见面，请选择您感兴趣的1-5个类别
                        </Text>
                    </View>
                    {this.renderGridView()}
                    <Button
                        containerStyle={styles.sureBtn}
                        style={styles.btnText}
                        text={'确认'}
                        onPress={() => this.onSelectCategory()}
                     />
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <ReadingToolBar 
                    title="分类"
                    actions={toolbarActions}
                    navigator={navigator}
                    onActionSelected={this.onActionSelected}
                />
                <View style={styles.header}>
                    <Text style={[styles.btnText, { color: 'black' }]}>
                        请选择您感兴趣的1-5个类别
                    </Text>
                </View>
                {this.renderGridView()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    header: {
        padding: 10,
        backgroundColor: '#fcfcfc'
    },
    btnText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#ffffff'
    },
    sureBtn: {
        margin: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#3e9ce9'
    },
    no_data: {

    },
    base: {
        flex: 1
    },
    gridLayout: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f2f2f2'
    },
    categoryBtn: {
        margin: 10,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#dddddd'
    },
    categoryText: {
        fontSize: 16,
        textAlign: 'center'
    }
});

Category.propTypes = propTypes;
// Category.contextTypes = contextTypes;

export default Category;