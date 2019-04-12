import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Icon, Menu } from 'antd';
import PropType from 'prop-types'

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
import './style.less';
import {connect} from "react-redux";
class Category extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            current: this.props.current
        }
    }
    handleClick(e) {
        this.setState({
            current: e.key
        })
      this.props.onClickAction(e.key);
    }
    render(){
        const { loginFlag } = this.props.userinfo;
        return(
            <div id='category'>
            <Menu
              style={{backgroundColor: 'white', borderBottomColor: 'red', color: 'black', width: '246px', float: 'left',
                height: "100%"
              }}
              theme='light'
              onClick={this.handleClick.bind(this)}
              selectedKeys={[this.state.current]}
              mode="vertical">
                <MenuItem key='message'>
                    比赛介绍
                </MenuItem>
                <MenuItem key='home'>
                    赛题与数据
                </MenuItem>
                {
                    loginFlag? <MenuItem key='grade'>个人成绩</MenuItem>: ''
                }

                {/*<MenuItem key='about'>*/}
                  {/*AboutUs*/}
                {/*</MenuItem>*/}
            </Menu>
            </div>
        )
    }
}
// Category.defaultProps = {
//   current: 'home',
// }

Category.propTypes = {
  // 分页内容
  current: PropType.oneOf(['home', 'grade', 'message']),
  //   current: PropType.oneOf(['home', 'rank']),
  // 换页
  onClickAction: PropType.func.isRequired,
}
function mapStateToProps(state) {
    return {
        userinfo: state.userinfo
    }
}
export default connect(mapStateToProps)(Category);