import  React from 'react';
import {hashHistory, Link} from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Category from '../../components/Category';
import Head from '../Header';
import Foot from  '../../components/Footer'
import { Layout, Button } from 'antd';
import './style.less';
const { Header, Content, Footer} = Layout;
class Message extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    handleClick() {
         window.open('http://182.150.37.74:88/dist', '_blank');
    }
    handleClickChoose(current) {
        // this.props.onClickAction(current);
        hashHistory.push(current);
    }
    render(){
        return(
            <Layout>
                <Header id='layout-header-diy'>
                    <Head current='about'/>
                </Header>
                <Content>
                    <div className="content-container">
                        <div className="sidebar-left">
                            <Category
                                current={this.props.current}
                                onClickAction={this.handleClickChoose.bind(this)}/>
                        </div>
                        <div className="sidebar-right">
                            <div className="introduce-container">
                                <h2>
                                    <span>01 /</span>
                                    比赛概述
                                </h2>
                                <p>“大数据月”算法比赛</p>
                                <p>
                                    在线评论的情感分析对于深刻理解商家和用户、挖掘用户情感等方面有着至关重要的价值。
                                    本次比赛利用算法建模，对用户评论文本进行情感分类。
                                </p>
                            </div>
                            <div className="introduce-container">
                                <h2>
                                    <span>02 /</span>
                                    重要时间
                                </h2>
                                <p>2019年4月12日 10:00 开放赛题和数据信息</p>
                                <p>2019年4月26日 19:00 关闭结果文件提交通道，开放代码提交</p>
                                <p>2019年4月27日 12:00 关闭代码提交</p>
                            </div>
                            {/*<div className="introduce-container">*/}
                                {/*<h2>*/}
                                    {/*<span>03 /</span>*/}
                                    {/*考试对象*/}
                                {/*</h2>*/}
                                {/*<p>考试面向大三选修数据分析与机器学习课程的学生</p>*/}
                            {/*</div>*/}
                            <div className="introduce-container">
                                <h2>
                                    <span>03 /</span>
                                    评测
                                </h2>
                                <p>每天提交次数不超过一次，每天零点以后更新评测成绩</p>
                            </div>
                            <div className="introduce-container bottom-support">
                                <h2>
                                    <span>04 /</span>
                                    提问群
                                </h2>
                                <p>QQ群: 320788543</p>
                                <img src="./images/qqchat.jpg" alt="群"/>
                            </div>
                        </div>
                    </div>
                </Content>
                <Footer id='layout-footer'>
                    <Foot />
                </Footer>
            </Layout>
        )
    }
}
Message.defaultProps = {
  current: 'message',
};
export default Message;