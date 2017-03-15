/**
 * app
 * @author lifuqiang
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Navigator
} from 'react-native';

import AV from 'leancloud-storage';
import {
    Router,
    Scene,
    ActionConst
} from 'react-native-router-flux';
import { connect } from 'react-redux';
import Splash from '../pages/Splash';
import CategoryContainer from '../containers/CategoryContainer';
import MainContainer from '../containers/MainContainer';
import Feedback from '../pages/Feedback';
import About from '../pages/About';
import TabIcon from '../components/TabIcon';

const RouterWithRedux = connect()(Router);
const backButton = require('../img/arrow_left.png');

const getSceneStyle = (props, computeProps) => {
    const style = {
        flex: 1,
        backgroundColor: '#fff',
        shadowColor: null,
        shadowOffset: null,
        shadowOpacity: null,
        shadowRadius: null,
    };

    if (computeProps.isActive) {
        style.marginTop = computeProps.hideNavBar ?
            0 : Navigator.NavigationBar.Styles.General.TotalNavHeight;
        style.marginBottom = computeProps.hideNavBar ? 0 : 50;
    }

    //console.log(style.marginTop);
    //console.log(style.marginBottom);

    return style;
}

class App extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <RouterWithRedux
                getSceneStyle={getSceneStyle}
                navigationBarStyle={styles.navBar}
                titleStyle={styles.navBarTitle}
                backButtonImage={backButton}
            >
                <Scene key="root">
                    <Scene key="splash" component={Splash} hideNavBar hideTabBar initial />
                    <Scene 
                        key="initCategory"
                        component={CategoryContainer}
                        hideNavBar
                        hideTabBar
                        type={ActionConst.REPLACE}
                    />
                    <Scene key="tabbar" tabs pressOpacity={0.8} type={ActionConst.REPLACE}>
                        <Scene 
                            key="main"
                            component={MainContainer}
                            hideNavBar
                            title="阅读"
                            icon={TabIcon}
                            iconName="md-home"
                        />
                        <Scene 
                            key="category"
                            component={CategoryContainer}
                            title="分类"
                            icon={TabIcon}
                            iconName="md-pricetags"
                        />
                        <Scene 
                            key="feedback"
                            component={Feedback}
                            title="建议"
                            icon={TabIcon}
                            iconName="md-thumbs-up"
                        />
                        <Scene 
                            key="about"
                            component={About}
                            title="关于"
                            icon={TabIcon}
                            iconName="md-information-circle"
                        />
                    </Scene>
                </Scene>
            </RouterWithRedux>
        );
    }
}

const styles = StyleSheet.create({
    navBar: {
        backgroundColor: '#3e9ce9'
    },
    navBarTitle: {
        color: '#ffffff',
        fontSize: 20,
    }
});

export default App;



