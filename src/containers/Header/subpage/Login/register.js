import  React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types'
import { Form, Button, Input, Icon, Checkbox, message, Spin } from 'antd'

import * as userInfoActionsFromOtherFile from '../../../../actions/userinfo.js';
import { getItem, setItem } from '../../../../util/storeUser';
import './style.less';
import zhuCeFetch from '../../../../fetch/zhuCe';
import getVerifyCode from '../../../../fetch/getVerifyCode';
import {hashHistory} from "react-router";
import Message from "../../../Message";
const FormItem = Form.Item;


class Login extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {

            loginLoading: false,

        }
    }


    handleSubmit(e)  {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {  username, passWord } = values;

                // setItem('userName', remember ? username : '');
                // setItem('passWord', remember ? passWord : '');
                // this.loginAction({username , passWord});

                // let result = zhuCeFetch({
                //     userId:username,
                //     userPassword: passWord
                // } , '');
                // result.then(resp=>{
                //             if (resp.status===502) {
                //                 message.error('502 Bad Gatway');
                //             } else if(resp.status===500) {
                //                 message.error('500 服务器内部错误');
                //             } else{
                //                 return resp.json()
                //             }
                //         })
                let myFetchOptions = {
                    method: 'POST'
                };
                fetch('/user/insert?userId='+username+'&userPassword='+passWord, myFetchOptions)
                    .then(resp=>{
                        if(resp.status===502){
                            message.error('502 Bad Gatway');
                        }else if(resp.status===500){
                            message.error('500 服务器错误');
                        }else{
                            message.success('注册成功！');
                            return resp.json();
                        }
                    })
                    .catch(error => console.log("err is" + error));
            }
        });
    }
    // componentWillUpdate(nextProps, nextState) {
    //     // console.log('nextProps, nextState', nextProps, nextState);
    //     if(nextProps.init&&!this.props.init) {
    //         // 更换
    //         // this.getVerifyCodeAction();
    //         this.props.form.setFieldsValue({
    //             verification: '??',
    //         });
    //     }
    // }
    // 登录动作
    // loginAction({  userId, passWord }) {
    //     const { login } = this.props.userInfoAction;
    //     let result = zhuCeFetch({
    //         userPassword:passWord,
    //         userId
    //     }, '' );
    //
    //     result.then(resp=>{
    //         if (resp.status===502) {
    //             message.error('502 Bad Gatway');
    //         } else if(resp.status===500) {
    //             message.error('500 服务器内部错误');
    //         } else{
    //             return resp.json()
    //         }
    //     })
    //         .then(data=>{
    //         if(data.code==0) {
    //             let token =data.data.authorization;
    //             // console.log('success', data);
    //             // 將登录信息保存入redux
    //             setItem('loginFlag', true);
    //             setItem('token', token);
    //             login({
    //                 token
    //             });
    //             // 更改登陆按钮状态
    //             this.changeLoginBtnLoadState(false);
    //             message.success('注册成功!');
    //             hashHistory.push(this.props.current);
    //             // 隐藏弹窗
    //             this.props.cb();
    //         } else {
    //             let info = data.message;
    //             message.error(info);
    //             if(info==='密码错误'){
    //                 this.props.form.setFields({
    //                     passWord: {
    //                         value: '',
    //                         errors: [new Error('密码错误!')],
    //                     },
    //                 });
    //             } else if(info==='用户名已存在') {
    //                 this.props.form.setFields({
    //                     userName: {
    //                         value: userName,
    //                         errors: [new Error('该用户已存在!')],
    //                     },
    //                 });
    //             }
    //
    //
    //             // 更改登陆按钮状态
    //             this.changeLoginBtnLoadState(false);
    //         }
    //     }).catch(ex =>{
    //         console.log('fetch error', ex.message);
    //     })
    // }
    handleRegister() {
        this.props.onRegister();
    }

    // 登录按钮状态切换
    changeLoginBtnLoadState(isLoading) {
        this.setState({
            loginLoading: isLoading
        })
    }

    checkPassword(rule, value, callback) {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('passWord')) {
            callback('你两次输入的密码不一样!');
        } else {
            callback();
        }
    }

    render(){
        const { getFieldDecorator } = this.props.form;

        return(
            <div id='header-login-container'>
                <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: [{ required: true,len: 12, message: '请输入你的学号' }],
                        })(
                            <Input prefix={<Icon style={{ fontSize: 13 }} />} placeholder="学号" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('passWord', {
                            rules: [{ required: true, message: '请输入你的密码' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="passWord" placeholder="密码" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('confirmPassWord', {
                            rules: [{ required: true, message: '请输入你的确认密码' },{
                                validator: this.checkPassword.bind(this)
                            }],
                        },)(
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="passWord" placeholder="确认密码" />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button loading={this.state.loginLoading} type="primary" htmlType='submit' className="login-form-button">
                            Register
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}
// <a className="login-form-forgot" href="javascript: void(0)">Forgot passWord</a>
const LoginWrap = Form.create()(Login);

LoginWrap.propTypes = {
    // 登录界面是否显示
    init: PropTypes.bool,
    // 登录成功的回调
    cb: PropTypes.func.isRequired,
    // 切换至注册页面
    onRegister: PropTypes.func.isRequired,
};
LoginWrap.defaultProps = {
    current: 'grade',
};
// 链接redux
function mapStateToProps(state) {
    return {
        userinfo: state.userinfo
    }
}
function mapDispatchToProps(dispatch) {
    return {
        userInfoAction: bindActionCreators(userInfoActionsFromOtherFile, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginWrap)