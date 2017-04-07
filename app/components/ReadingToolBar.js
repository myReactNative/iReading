import React, { PropTypes } from 'react';
import {
    StyleSheet,
    Platform,
    View,
    Text
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { naviGoBack } from '../utils/CommonUtil';
import Button from './Button';

let showActionButton = false;

const propTypes = {
    title: PropTypes.string,
    actions: PropTypes.array,
    navigator: PropTypes.object,
    onActionSelected: PropTypes.func,
    onIconClicked: PropTypes.func,
    navIconName: PropTypes.string
};

const ReadingToolBar = ({title, actions, navigator, onActionSelected, onIconClicked, navIconName}) => {
    const handleIconClicked = () => {
        if (onIconClicked) {
            onIconClicked();
        } else if (navigator) {
            naviGoBack(navigator);
        }
    };

    const renderToolbarAndroid = () => (
        <Icon.ToolbarAndroid 
            style={styles.toolbar}
            actions={actions}
            onActionSelected={onActionSelected}
            onIconClicked={handleIconClicked}
            navIconName={navIconName === undefined ? 'md-arrow-back' : navIconName}
            titleColor="#fff"
            title={title}
            overflowIconName="md-more"
        />
    );

    const renderToolbarIOS = () => {
        const action = actions[0];
        showActionButton = action !== undefined;

        return (
            <View style={styles.toolbar}>
                <Icon.Button 
                    name={navIconName === undefined ? 'ios-arrow-back' : navIconName}
                    iconStyle={styles.leftIOS}
                    onPress={handleIconClicked}
                    backgroundColor="transparent"
                    underlayColor="transparent"
                    activeOpacity={0.8}
                />
                <Text 
                    style={[styles.titleIOS,
                    showActionButton ? { paddingLeft: 0 } : { paddingLeft: -35}]}
                    numberOfLines={1}
                >
                    {title}
                </Text>
                {showActionButton && action.show === 'always' ? 
                    <Icon.Button 
                        iconStyle={showActionButton ? styles.rightIOS : styles.zero}
                        name={action.iconName}
                        backgroundColor="transparent"
                        underlayColor="transparent"
                        activeOpacity={0.8}
                        onPress={onActionSelected}
                    /> :
                    <Button 
                        containerStyle={showActionButton ? styles.rightIOS : styles.zero}
                        style={styles.rightText}
                        text={showActionButton ? action.title : ''}
                        onPress={onActionSelected}
                    />
                }
            </View>
        );
    };

    const Toobar = Platform.select({
        android: () => renderToolbarAndroid(),
        ios: () => renderToolbarIOS()
    });

    return <Toobar />

}

const styles = StyleSheet.create({
    toolbar: {
        flexDirection: 'row',
        backgroundColor: '#3e9ce9',
        alignItems: 'center',
        height: 58
    },
    leftIOS: {
        marginTop: 20,
        marginLeft: 8
    },
    rightIOS: {
        marginTop: 20,
        marginRight: 8
    },
    titleIOS: {
        flex: 1,
        textAlign: 'center',
        color: '#fff',
        fontSize: 20,
        marginTop: 20
    },
    zero: {
        height: 0,
        width: 0
    },
    rightText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 18
    }
});

ReadingToolBar.propTypes = propTypes;
ReadingToolBar.defaultProps = {
    onActionSelected() {},
    title: '',
    actions: []
};

export default ReadingToolBar;