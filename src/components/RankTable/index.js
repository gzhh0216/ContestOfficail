import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Table } from 'antd';
import PropTypes from 'prop-types';

import './style.less';

class RankTable extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
          isAvailable: true, 
        } 
    }
    handleFreshData() {
      this.setState({isAvailable: false});
      this.props.RefreshData();
      setTimeout(()=>{ this.setState({isAvailable: true}) }, 3500);
    }
    render(){
        const columns = [,{
          title: '学号',
          dataIndex: 'name',
          key: 'name',
          width: '55%',
          render: (text, record) => {
            return (
              <span className='teamname-wrap'>{text}</span>
            )
          }
        },{
          title: '最高得分',
          dataIndex: 'maxScore',
          key: 'maxScore',
        }]
        const {  loading } = this.props;
        const message = this.props.message;
        let data = [{
            key : "1",
            name: "2019",
            maxScore: "20",
        }]
        const { isAvailable } = this.state;

        const btnStyle = { marginBottom: '2px' };
        return(
            <div className='home-section-container rank-table' style={{ backgroundColor: 'white' }}>
            <Table
            loading={loading}
            dataSource={message}
            columns={columns}
            rowKey="teamId"
            />
            </div>
        )
    }
}

RankTable.propTypes = {
  // 刷新表数据
  RefreshData: PropTypes.func.isRequired,
  // 表格数据
  data: PropTypes.array,
  // 是否处在加载状态
  loading: PropTypes.bool.isRequired,
};
export default RankTable;