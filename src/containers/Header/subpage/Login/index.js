import  React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types'
import { Form, Button, Input, Icon, Checkbox, message, Spin } from 'antd'

import * as userInfoActionsFromOtherFile from '../../../../actions/userinfo.js';
import { getItem, setItem } from '../../../../util/storeUser';
import './style.less';
import loginFetch from '../../../../fetch/login';
import getVerifyCode from '../../../../fetch/getVerifyCode';
import {hashHistory} from "react-router";
import Message from "../../../Message";
const FormItem = Form.Item;


class Login extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            verifyCode: '',
            verifyHead: '',
            verifyKey: '',
            loginLoading: false,
            verifyCodeLoading: false,
        }
    }
    componentDidMount() {
        let userName = getItem('userName');
        let passWord = getItem('passWord');
        let { setFieldsValue } = this.props.form;
        setFieldsValue({
            userName: !!userName?userName:'',
            passWord: !!passWord?passWord:''
        });
        // 获取验证码
        this.getVerifyCodeAction();
    }
    // 获取验证码动作
    getVerifyCodeAction() {
        this.setState({
            verifyCodeLoading: true,
            loginLoading: false
        });
        let result = getVerifyCode();
        result.then(resp=>{
            if (resp.ok) {
                // console.log(resp);
                // this.setState({
                //     verifyHead: resp.headers.get('Verify-code'),
                // });
                return resp.text()
            }
        }).then(resp =>{

            resp = JSON.parse(resp);
            let verifyCode = resp.data.verifyCode;
            let verifyKey = resp.data.verifyKey;
            this.setState({
                verifyCode,
                verifyKey,
                verifyCodeLoading: false,
            });
        })
    }
    handleSubmit(e)  {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { remember, username, passWord } = values;
                setItem('userName', remember ? username : '');
                setItem('passWord', remember ? passWord : '');
                this.loginAction(values);
                this.changeLoginBtnLoadState(true);
            }
        });
    }
    componentWillUpdate(nextProps, nextState) {
        // console.log('nextProps, nextState', nextProps, nextState);
        if(nextProps.init&&!this.props.init) {
            // 更换
            this.getVerifyCodeAction();
            this.props.form.setFieldsValue({
                verification: '??',
            });
        }
    }
    // 登录动作
    loginAction({ verification, username, passWord }) {
        const { login } = this.props.userInfoAction;
        const {  verifyKey } = this.state;
        let result = loginFetch({
            userId: username,
            userPassword: passWord,
            verifyCode: verification
        }, '', verifyKey );

        result.then(resp=>{
            if (resp.status===502) {
                message.error('502 Bad Gatway');
            } else if(resp.status===500) {
                message.error('500 服务器内部错误');
            } else{
                return resp.json()
            }
        }).then(data=>{
            if(data.code==0) {
                let token =data.data.authorization;
                // console.log('success', data);
                // 將登录信息保存入redux
                setItem('loginFlag', true);
                setItem('token', token);
                login({
                    token
                });
                // 更改登陆按钮状态
                this.changeLoginBtnLoadState(false);
                message.success('登陆成功!');
                hashHistory.push(this.props.current);
                // 隐藏弹窗
                this.props.cb();
            } else {
                let info = data.message;
                message.error(info);
                if(info==='密码错误'){
                    this.props.form.setFields({
                        passWord: {
                            value: '',
                            errors: [new Error('密码错误!')],
                        },
                    });
                } else if(info==='用户名不存在') {
                    this.props.form.setFields({
                        userName: {
                            value: userName,
                            errors: [new Error('该用户不存在!')],
                        },
                    });
                }else if(info==='验证码错误'){
                    this.props.form.setFields({
                        verification: {
                            value: verification,
                            errors: [new Error('不正确的验证码!')],
                        },
                    });
                }

                // 登录失败时更新验证码
                this.getVerifyCodeAction();
                // 更改登陆按钮状态
                this.changeLoginBtnLoadState(false);
            }
        }).catch(ex =>{
            console.log('fetch error', ex.message);
        })
    }
    handleRegister() {
        this.props.onRegister();
    }
    handleChangeVerifyCode(e) {
        this.getVerifyCodeAction();
    }
    // 登录按钮状态切换
    changeLoginBtnLoadState(isLoading) {
        this.setState({
            loginLoading: isLoading
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const { verifyCode } = this.state;
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
                        {getFieldDecorator('verification', {
                            rules: [{ required: true, message: '请输入你的验证码!' }],
                        })(
                            <div>
                                <Input placeholder='验证码' prefix={<Icon type="credit-card" style={{ fontSize: 13 }} />} style={{width: '60%'}} />
                                <span className='login-input-verification' onClick={this.handleChangeVerifyCode.bind(this)}>
                      <Spin spinning={this.state.verifyCodeLoading}>
                        <img alt='loading' title='click me to change one' src={`data:image/png;base64,${verifyCode}`}/>
                      </Spin>
                      </span>
                            </div>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>记住我</Checkbox>
                        )}
                        <Button loading={this.state.loginLoading} type="primary" htmlType='submit' className="login-form-button">
                            Log in
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