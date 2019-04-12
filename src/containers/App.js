import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Category from '../components/Category';
// import enUS from 'antd/lib/locale-provider/en_US';
// import { LocaleProvider } from 'antd';
// import enUS from 'antd/lib/locale-provider/en_US';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userinfoActionFromOtherFiles from '../actions/userinfo.js';
import { getItem } from '../util/storeUser';

import '../static/style/common.less';
import {hashHistory} from "react-router";
class App extends React.Component { 
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            initDone: true,
        }
    }
    render() { 
        return ( 
            <div>
            {   this.state.initDone?
                this.props.children:
                 <div>加载中...</div>
            }
            </div>
        ) 
    } 
}
            // <LocaleProvider locale={enUS}>
            // </LocaleProvider>
function mapStateToProps(state) {
    return {
        userinfo: state.userinfo,
    }
}    

function mapDispatchToProps(dispatch) {
    return {
        userinfoAction: bindActionCreators(userinfoActionFromOtherFiles, dispatch),
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
