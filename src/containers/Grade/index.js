import  React from 'react';
import {hashHistory, Link} from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Layout, message } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Category from '../../components/Category';
import getRank from '../../fetch/getRank';
import Foot from '../../components/Footer';
import Head from '../Header';
import { getItem, setItem } from '../../util/storeUser';
// import ContestInfo from '../../components/ContestInfo';
import RankTable from '../../components/RankTable';
import UploadFile from '../../components/Upload';
import './style.less';

const { Header, Content, Footer} = Layout;
class Grade extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            data: null,
            loading: false,
            token: null,
            allowUpdateFlag: false
        }
    }
    componentDidMount() {
        const token = getItem('token');
        console.log(token);
        this.setState({
            token: token
        });
        this.getRankAction();
    }
    // 获取排行榜数据
    getRankAction() {
        this.setState({loading: true});
        let token = getItem('token');
        console.log(token);
        let result = getRank('',token);
        result.then(resp => {
            if (resp.ok) {
                return resp.json()
            }
        }).then(resp =>{
            try{
                if (resp.code==0){
                    console.log(resp);
                    const data = [{
                        key: '1',
                        name: resp.data.userId,
                        maxScore: resp.data.userScore
                    }];
                    this.setState({data, loading: false});
                }else if(resp.code == 2){
                    message.error("请重新登陆!");
                    setItem('loginFlag', false);
                    setItem('token', null);
                    setItem('userName', null);
                    setItem('passWord', null);
                    setItem('lastestTime', (new Date()).getTime());
                    hashHistory.push(this.props.turnPage)
                }
            }catch(e){
                console.log(e)
            }
        })
    }

    handleClickChoose(current) {
        // this.props.onClickAction(current);
        console.log("hhhhhhh");
        console.log('current', current);
        hashHistory.push(current);
    }
    handleCode(){
        message.error("改通道还未开放");
    }
    render(){
        const { data, loading } = this.state;
        const { loginFlag } = this.props.userinfo;
        //未登陆不允许上传文件
        if (loginFlag == true) {
            this.setState({
                allowUpdateFlag: false
            })
        }else if (loginFlag == false) {
            this.setState({
                allowUpdateFlag: true
            })
        }
        return(
            <Layout>
                <Header id='layout-header-diy'>
                    <Head current='rank'/>
                </Header>
                <Content>
                    <div className="content-container">
                        <div className="sidebar-left">
                            <Category
                                current={this.props.current}
                                onClickAction={this.handleClickChoose.bind(this)}/>
                        </div>
                        <div className="sidebar-right">
                            <RankTable
                                RefreshData={this.getRankAction.bind(this)}
                                message={data}
                                loading={loading}/>
                            <div className="upload-container">
                                    <UploadFile
                                        token={this.state.token}
                                        allowUpdateFlag={this.state.allowUpdateFlag}
                                        action={"/file/upload"}
                                        name="提交结果"
                                    />   
                                <div onClick={ this.handleCode.bind(this) } style={{display:"inline-block"}}>
                                    <UploadFile
                                        token={this.state.token}
                                        action={"/file/submit"}
                                        name="上传代码"
                                        allowUpdateFlag="true"
                                    />
                                </div>
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
Grade.defaultProps = {
    current: 'grade',
    turnPage: 'message'
};

// <ContestInfo />

function mapStateToProps(state) {
    return {
        userinfo: state.userinfo
    }
}
export default connect(mapStateToProps)(Grade);