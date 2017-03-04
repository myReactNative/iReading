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
    const style = {};

    return style;
}

class App extends Component {

    constructor(props) {
        super(props);
        console.log("hello");
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

    },
    navBarTitle: {

    }
});

export default App;



