import  React from 'react';
import { hashHistory } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Layout, message, Modal, Button, Popconfirm  } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userInfoActionsFromOtherFile from '../../actions/userinfo.js';
import Category from '../../components/Category';
import Head from '../Header';
import Foot from '../../components/Footer';
import './style.less';

const { Header, Content, Footer} = Layout;
class Introduce extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            visible: false,
            matched: false,
            isCreateTeam: false,
        }
    }
    componentDidMount() {

    }
    handleClick(current) {
        this.setState({current});
    }
    handleTakeIn() {
        const UNLOG = 'stateless';
        let matched  = !!this.props.userinfo.token ? this.props.userinfo.matched : UNLOG;
        console.log('matched before', matched);

        if (typeof matched === 'string' && matched!==UNLOG) {
            matched = matched === 'true' ? true : false;
        }
        console.log('matched after', matched);
        if (matched==true) {
            // message.info('你已经参加了比赛');
            hashHistory.push('rank');
        } else if (matched===UNLOG) { 
            message.info('请先登录');
        } else {
            this.setState({visible: true})
        }
    }
    hideModal(){
        this.setState({visible:false})
    }
    handleCreateTeam({teamName, members}) {
        const { token, mail } = this.props.userinfo;
        let result = createTeam({teamName, teamerMail: members}, '', token, mail);
        result.then(resp=>{
            if (resp.status === 500) {
                message.error('服务器内部错误');
            } else if(resp.status === 502){
                message.error('Bad Gatway');
            } else if(resp.status === 403){
                console.log(resp.statusText);
                return resp.json()
            } else {
                return resp.text()
            }
        }).then(info=>{
            console.log('info', info);
            if (typeof info === 'string') {
                message.success('Your team has been created successfully!');
                this.props.userinfoAction.match({
                    matched: true,
                    teamId: info-=0,
                })
                this.setState({isCreateTeam: true});
            } else { 
                message.error(info.msg);
            }
        }).catch(ex=>{
            console.log('catch error', ex.message);
        })
    }
    getTestPop() {
        console.log('from pop');
    }
    getTestBtn() {
        console.log('from Btn');
    }
    handleClickChoose(current) {
        // this.props.onClickAction(current);
        console.log("hhhhhhh")
        console.log('current', current);
        hashHistory.push(current);
    }

    submit(){
        message.error("数据集还未开放")
    }
    render(){
        let { matched } = this.props.userinfo;
        if (typeof matched === 'string') {
            matched = matched === 'true' ? true : false;
        }
        console.log('isMatched', matched);
        const { mail, token } = this.props.userinfo;
        return(
            <Layout>
                <Header id='layout-header-diy'>
                    <Head current='home'/>
                </Header>
                <div className="content-container">
                    <div className="sidebar-left">
                        <Category
                            current={this.props.current}
                            onClickAction={this.handleClickChoose.bind(this)}/>
                    </div>
                    <div className="sidebar-right">
                        {/*         任务描述      */}
                        <div className="introduce-container">
                            <h2>
                                <span>01 /</span>
                                赛题简介
                            </h2>
                            <p>在线评论的情感分析对于深刻理解商家和用户、挖掘用户情感等方面有着至关重要的价值，
                                并且在互联网行业有极其广泛的应用，主要用于个性化推荐、智能搜索、产品反馈、业务安
                                全等。本次比赛提供了一个包含50219条数据的数据集。其中包含10个类别（书籍、平板、
                                手机、水果、洗发水、热水器、蒙牛、衣服、计算机、酒店）的在线评论的情感倾向。参赛
                                人员需根据标注的情感倾向建立模型，对用户评论进行情感挖掘，然后通过计算参赛者提交
                                的预测值和场景真实值之间的误差确定预测正确率，评估所提交的预测算法。
                            </p>
                        </div>
                        {/*          数据描述       */}
                        <div className="introduce-container">
                            <h2>
                                <span>02 /</span>
                                数据描述
                            </h2>
                            <strong>1.数据集说明：</strong>
                            <p>
                                数据集包含10个类别（书籍、平板、手机、水果、洗发水、热水器、蒙牛、衣服、计算机、酒店），
                                一共50219条评论数据，正负向评论各约2万条。
                            </p>
                            <br/>
                            <strong>2.字段说明:</strong>
                            <div className="table-container">
                                <table>
                                    <tr>
                                        <th>字段</th>
                                        <th>说明</th>
                                    </tr>
                                    <tr>
                                        <td>cat</td>
                                        <td>类别：书籍、平板、手机、水果、洗发水、热水器、蒙牛、衣服、计算机、酒店</td>
                                    </tr>
                                    <tr>
                                        <td>label</td>
                                        <td>1表示Positive，0表示Negative</td>
                                    </tr>
                                    <tr>
                                        <td>review</td>
                                        <td>评论内容</td>
                                    </tr>
                                </table>
                            </div>



                        <div className="introduce-container">
                            <h2>
                                <span>03 /</span>
                                结果提交说明
                            </h2>
                            <p>参赛者根据训练的模型对测试集中的文本情感进行预测，提交预测结果，预测结果使用0或者1进行描述 ，
                                返回的结果需保存为csv文件。格式如下：
                            </p>
                            <div className="table-container">
                                <table>
                                    <tr>
                                        <th>ID</th>
                                        <th>lable</th>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>1</td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>1</td>
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>0</td>
                                    </tr>
                                    <tr>
                                        <td>4</td>
                                        <td>1</td>
                                    </tr>
                                </table>
                            </div>

                        </div>


                    </div>
                </div>
                </div>
                <Footer id='layout-footer'>
                    <Foot />
                </Footer>
            </Layout>

        )
    }
}
Introduce.defaultProps = {
    current: 'home',
};
                    // <Test id="content_7_0" key="content_7_0" isMode={this.state.isMode}/>

function mapStateToProps(state) {
    return {
        userinfo: state.userinfo
    }
}
function mapStateToDispatch(dispatch) {
    return {
        userinfoAction: bindActionCreators(userInfoActionsFromOtherFile, dispatch)
    }
}
export default connect(mapStateToProps, mapStateToDispatch)(Introduce);
