import React, {Component} from 'react'
import {Upload, Icon} from 'antd'
import {uploadUrl} from '../configs/url'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as _actions from '../actions/fileList'
import {getData} from '../actions/getData'
let actions = Object.assign({}, _actions, {getData})

class UploadImage extends Component {
    constructor() {
        super()
        // window.updateUrl = true
        this.handleChange = this.handleChange.bind(this)
        this.handleClean = this.handleClean.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleBefore = this.handleBefore.bind(this)
        this.handlePreview = this.handlePreview.bind(this)
    }

    handlePreview(file) {
        if (!file.url) return false
        this.props.getPos(file)
        let dom = document.querySelector('#bannerUrl' + window.i)
        dom.focus()
        window.open(file.url)
        return true
    }

    handleRemove(file) {
        // console.log('file:', file)
        this.props.cleanFile(file)
        let dom = document.querySelector('#bannerUrl' + window.i)
        dom.focus()
        dom.value = ''
        // window.updateUrl = false
    }

    handleBefore(file) {
        console.info('before:', file)
        let filename = file.name.toLowerCase()
        let arr = filename.split('.')
        let cb = this.props.beforeCb
        if (arr.length < 2 || arr[arr.length - 1].replace(/(jpg|jpeg|png|gif)/g, '').length > 0) {
            if (typeof cb === 'function') cb('上传格式错误', '支持格式为png、jpeg、jpg、gif')
            return false
        }
        if (file.size > 10485760) {
            if (typeof cb === 'function') cb('上传大小错误', '请上传小于10M的图片')
            return false
        }
        // test network...
        this.props.getData()
        return true
    }

    handleChange(info) {
        console.log('handleChange')
        const {position} = this.props
        let errorCb = this.props.errorCb
        let cb = this.props.changeCb
        let file = info.file
        if (file.status === 'removed') return false
        if (file.response && (file.response.retcode !== 0 || !file.response.data)) {
            if (typeof errorCb === 'function') {
                errorCb('上传失败', '上传出现错误')
            }
            return false
        }
        if (file.response && file.response.retcode === 0) file.url = file.response.data
        else {
            if (typeof errorCb === 'function' && file.status === 'error') {
                errorCb('上传失败', '请检查您的网络并重试')
                return false
            }
        }
        this.props.cleanBannerFile(position)
        this.props.setBannerFile(file, position)

        if (typeof cb === 'function') cb(position)
    }

    handleClean() {
        let cleanFile = {
            article: this.props.cleanArticleFileList,
            banner: this.props.cleanBannerFile
        }
        cleanFile[this.props.type](this.props.position)
    }

    render() {
        const props = {
            action: uploadUrl,
            listType: 'picture-card',
            multiple: true,
            onChange: this.handleChange,
            onPreview: this.handlePreview,
            onRemove: this.handleRemove,
            accept: '.jpg,.jpeg,.png,.gif',
            beforeUpload: this.handleBefore
        }
        let {fileList, position} = this.props
        if (this.props.type === 'article') fileList = fileList.article
        else {
            let file = fileList.banner[position || 0]
            fileList = file ? [file] : []
        }
        return (
            <div className="clearfix">
                <Upload {...props} fileList={fileList}>
                    <Icon type="plus" style={{fontSize: '28px'}} />
                    <div className="ant-upload-text">上传图片</div>
                </Upload>
            </div>
        );
    }
}

let mapStateToProps = state => {
    return {
        fileList: state.fileList
    }
}
let mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(UploadImage)
