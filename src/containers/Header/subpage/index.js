import  React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Icon, Button, Modal, message } from 'antd';
import Login from './Login';
import { hashHistory } from 'react-router';
import Register from './Register';
import ZhuCe from './Login/register';
import PropTypes from 'prop-types';
import { getItem, setItem } from '../../../util/storeUser';
import './style.less';
import {connect} from "react-redux";

import * as userinfoActionFromOtherFiles from "../../../actions/userinfo";
import {bindActionCreators} from "redux";
class User extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            loginVisible: false,
            registerVisible: false,
            zhuCeVisible:false,
            loginFlag: null,
        }
    }

    hideModal() {
      this.setState({
        loginVisible: false,
        registerVisible: false,
          zhuCeVisible:false,

      })
    }
    showModal(modalName) {
          this.setState({
              [modalName]: true,
          })
    }
    handleToRegistration() {
      this.setState({
        loginVisible: false,
        registerVisible: true,
          zhuCeVisible:false,

      })
    }
    handleToLogin(){
      this.setState({
        loginVisible: true,
        registerVisible: false,
          zhuCeVisible:false,

      })
    }
    handleToZhuCe(){
        this.setState({
            loginVisible: false,
            registerVisible:false,
            zhuCeVisible:true,

        })
    }
    signOut(){
        //注销
        console.log("yijin");
        setItem('loginFlag', false);
        const { logout } = this.props.userinfoAction;
        logout();
        hashHistory.push(this.props.current);
    }

    componentDidMount(){
        const { login } = this.props.userinfoAction;
        let loginFlag = getItem('loginFlag');
        if (loginFlag == "true"){
            loginFlag = true
        } else if(loginFlag = 'false'){
            loginFlag = false
        }
        login({
            loginFlag: loginFlag
        });
    }
    render(){
        const  userinfo = this.props.userinfo;
        let loginFlag = userinfo.loginFlag;
        return(
            <div id='header-user'>
                        <span className='header-user-container header-btn-container'>
                            {

                                loginFlag? <Button ghost type='dashed' onClick={this.signOut.bind(this)}>注销</Button> : <Button  onClick={this.showModal.bind(this,'zhuCeVisible') } ghost>注册</Button>

                            }
                </span>
                    <span className='header-btn-container'>
                        {
                            loginFlag? <Button onClick={this.showModal.bind(this, 'registerVisible')} ghost>修改密码</Button> : <Button onClick={this.showModal.bind(this, 'loginVisible')} ghost>登陆</Button>

                        }


                        </span>
                <Modal
                    width='350'
                    title={null}
                    footer={null}
                    visible={this.state.zhuCeVisible}
                    onOk={this.hideModal.bind(this)}
                    onCancel={this.hideModal.bind(this)}
                >
                    <p id='login-logo-container'>
                        <img className='login-logo-img' src='./images/xiaohui.jpg'/>
                    </p>
                    <ZhuCe
                        init={this.state.zhuCeVisible}
                        cb={this.hideModal.bind(this)}
                        onRegister={this.handleToRegistration.bind(this)} />
                </Modal>
            <Modal
              width='350'
              title={null}
              footer={null}
              visible={this.state.loginVisible}
              onOk={this.hideModal.bind(this)}
              onCancel={this.hideModal.bind(this)}
             >
              <p id='login-logo-container'>
                <img className='login-logo-img' src='./images/xiaohui.jpg'/>
              </p>
              <Login  
                init={this.state.loginVisible} 
                cb={this.hideModal.bind(this)} 
                onRegister={this.handleToRegistration.bind(this)} />
            </Modal>
                <Modal
                    title='修改密码'
                    visible={this.state.registerVisible}
                    onOk={this.hideModal.bind(this)}
                    onCancel={this.hideModal.bind(this)}
                    footer={null}
                >
                    <Register
                        init={this.state.registerVisible}
                        onLogin={this.hideModal.bind(this)}/>
                </Modal>
            </div>
        )
    }
}

User.propTypes = {
  // 获取用户信息
  getTeamInfoAction: PropTypes.func,
  // 队伍信息
  teamInfo: PropTypes.array,
  // username
  username: PropTypes.string,
  // 注销动作
  signOut: PropTypes.func,
}
User.defaultProps = {
    current: 'message',
};
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
)(User)