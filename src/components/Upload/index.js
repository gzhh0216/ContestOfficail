import  React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Upload, message, Button, Icon, Anchor  } from 'antd';
import PropTypes from 'prop-types';
import './style.less';



class UploadFile extends React.Component{
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.submit = this.submit.bind(this);
    }

    submit() {
        if (this.props.allowUpdateFlag === true) {
            message.error("请登陆后再上传文件")
        }
    }
    render(){
        const props = {
            name: 'file',
            action: this.props.action,
            headers: {
                authorization: this.props.token,
            },
            onChange(info) {
                try{
                    let resp = info.file.response;
                    if (info.file.status !== 'uploading') {
                        console.log(info.file, info.fileList);
                    }
                    console.log(resp.code)
                    if (info.file.status === 'done') {
                        if (resp.code == 1){
                            message.error(`${info.file.name} 上传失败.`);
                            message.error(resp.message);
                        }  else{
                            message.success(`${info.file.name} 文件上传成功`);
                        }
                    } else if (info.file.status === 'error') {
                        message.error(`${info.file.name} 文件上传失败.`);
                    }
                }catch (e) {
                    console.log("考试加油")
                }
            },
        };
        return(
            <div id='context-container'>
                <Upload {...props} disabled={this.props.allowUpdateFlag}>
                    <Button onClick={ this.submit }>
                        <Icon type="upload" /> {this.props.name}
                    </Button>
                </Upload>
            </div>
        )
    }
}

UploadFile.propTypes = {
  token: PropTypes.string.isRequired,
};
export default UploadFile;