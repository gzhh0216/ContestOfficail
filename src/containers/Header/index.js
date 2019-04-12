import  React from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import User from './subpage';
import Logo from '../../components/Logo'
import { bindActionCreators } from 'redux';

import * as userInfoActionsFromOtherFile from '../../actions/userinfo.js';

// import * as fetchType from '../../constants/fetchType';



import './style.less';
class Header extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    signOutAction() {
      this.props.userinfoAction.logout();
    }
    // 是否面密登录
    componentDidMount() {

    }
    componentWillUpdate(nextProps, nextState) {
    }
    render(){
        const userinfo = this.props.userinfo;
        const username = userinfo.username || '';
        return(
            <div className='header-inner-container'>
              <User
                username={username}
              />

              {/*<Category*/}
                {/*current={this.props.current}*/}
                {/*onClickAction={this.handleClick.bind(this)}/>*/}
              <Logo/>

            </div>
        )
    }
}


///  链接redux

function mapStateToProps(state) {
    return {
        userinfo: state.userinfo
    }
}
function matDispatchToProps(dispatch) {
    return {
        userinfoAction: bindActionCreators(userInfoActionsFromOtherFile, dispatch)
    }
}
export default connect(
    mapStateToProps,
    matDispatchToProps
)(Header);
