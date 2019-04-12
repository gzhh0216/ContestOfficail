import  React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import PropTypes from 'prop-types';
import { Form, Input, Tooltip, Icon, Row, Col, Button, message, Spin, notification } from 'antd';
import register from '../../../../fetch/register';
import getVerifyCode from '../../../../fetch/getVerifyCode';
import './style.less';
import { getItem, setItem } from '../../../../util/storeUser';
import { hashHistory } from 'react-router';
import * as userInfoActionsFromOtherFile from "../../../../actions/userinfo";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
const FormItem = Form.Item;
class Register extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
          confirmDirty: false,
          verifyCode: '',
          captchaHead: '',
          verifyKey: '',
          verifyCodeLoading: false,
        }
    }
    componentDidMount() {
      this.getVerifyCodeAction();
    }
    componentWillUpdate(nextProps, nextState) {
      if(nextProps.init&&!this.props.init) {
        this.getVerifyCodeAction();
        this.props.form.setFieldsValue({
          verification: '',
        });
      }
    }
    // 表单提交
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.registerAction(values);
          }
        });
    }
    // 注冊
    registerAction({name, oldPassword, newPassword, verification}) {
      let token = getItem('token');
      let { verifyKey } = this.state;
      let result = register({
          userId: name,
          oldPassword: oldPassword,
          newPassword: newPassword,
          verifyCode: verification
      },verifyKey, token);
      result.then(resp =>{
        if (resp.status===502) {
            message.error('502 Bad Gatway');
          } else if(resp.status===500) {
            message.error('500 服务器内部错误');
          } else if(resp.status===403) {
            message.error('邮箱已經被注册,请更换过后再试');
          } else{
            return resp.json()
          }
      }).then(text=>{
        if (text.code == 0){
            message.success("修改成功");
            message.success("请重新登陆");
            setItem('loginFlag', false);
            setItem('token', null);
            setItem('userName', null);
            setItem('passWord', null);
            setItem('lastestTime', (new Date()).getTime());
            hashHistory.push(this.props.current)
        }else{
            this.getVerifyCodeAction();
            let info = text.message;
            message.error(info);
            if(info==='旧密码错误'){
                this.props.form.setFields({
                    oldPassword: {
                        value: '',
                        errors: [new Error('旧密码错误!')],
                    },
                });
            } else if(info==='用户名不存在') {
                this.props.form.setFields({
                    name: {
                        value: name,
                        errors: [new Error('该用户不存在!')],
                    },
                });
            }else if(info==='验证码错误') {
                this.props.form.setFields({
                    verification: {
                        value: verification,
                        errors: [new Error('不正确的验证码!')],
                    },
                });
            }
        }

      })
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
    // 
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    // 校验确认密码
    checkPassword(rule, value, callback) {
      const form = this.props.form;
      if (value && value !== form.getFieldValue('newPassword')) {
        callback('你两次输入的密码不一样!');
      } else {
        callback();
      }
    }
    // 
    checkConfirm(rule, value, callback) {
      const form = this.props.form;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    }
    // 
    handleChangeVerifyCode(e) {
      this.getVerifyCodeAction();
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const { verifyCode } = this.state;
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
          },
        };
        const verifyItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          },
        }
         const tailFormItemLayout = {
          wrapperCol: {
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 4,
              offset: 16,
            },
          },
        };
        return(
            <Form onSubmit={this.handleSubmit.bind(this)}>
                 <FormItem 
                 {...formItemLayout}
                 label='学号:'
                 hasFeedback>
                 {
                    getFieldDecorator('name', {
                        rules: [{
                            len: 12,
                            message: '输入的不是正确的学号',
                        },{
                            required: true,
                            message: '请输入你的学号',
                        }]
                    })(
                        <Input placeholder=''/>
                    )}
                 </FormItem>
                 <FormItem 
                 {...formItemLayout}
                 label='旧密码'
                 hasFeedback>
                 {
                    getFieldDecorator('oldPassword', {
                        rules: [{
                            message: '输入的不是正确的密码',
                        },{
                            required: true,
                            message: '请输入你的密码',
                        }]
                    })(
                        <Input  type="password" placeholder='你的旧密码'/>
                    )}
                 </FormItem>
                  <FormItem 
                 {...formItemLayout}
                 label='新密码:'>
                 {
                    getFieldDecorator('newPassword', {
                        rules: [{
                          required: true,
                          message: '请输入你的密码',
                        },{
                          validator: this.checkConfirm.bind(this)
                        }]
                    })(
                        <Input  type="password"/>
                    )}
                 </FormItem>
                 <FormItem 
                 {...formItemLayout}
                 label='确认新密码:'>
                 {
                    getFieldDecorator('confirm', {
                        rules: [{
                          required: true,
                          message: '请确认你的新密码!',
                        },{
                          validator: this.checkPassword.bind(this)
                        }]
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur.bind(this)} />
                    )}
                 </FormItem>

                 <FormItem 
                 {...verifyItemLayout}
                 label='验证码'

                 hasFeedback>
                 {
                    getFieldDecorator('verification', {
                        rules: [{
                            message: '输入的不是正确的验证码',
                        },{
                            required: true,
                            message: '请输入正确的验证码',
                        }]
                    })(
                      <p>
                        <Input placeholder='输入你的验证码'/>
                      </p>
                    )}
                      <span className='register-verification' onClick={this.handleChangeVerifyCode.bind(this)}>
                        <Spin spinning={this.state.verifyCodeLoading}>
                          <img alt='loading' title='click me to change one' src={`data:image/png;base64,${verifyCode}`}/>
                        </Spin>
                      </span>
                 </FormItem>
                 <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">确认</Button>
                 </FormItem>
            </Form>

        )
    }
}

const RegisterWrap = Form.create()(Register);

RegisterWrap.propTypes =  {
  // 注册页面是否显示
  init: PropTypes.bool,
  // 切换至登录页面
  onLogin: PropTypes.func,
  // test: PropTypes.string.isRequired,
};
Register.defaultProps = {
    current: 'message',
};
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
)(RegisterWrap)