import React, {Component} from 'react'
import { Input, Select, Checkbox, Button, DatePicker, Form, Modal } from 'antd'
import moment from 'moment'
import WangEditor from '../components/WangEditor'
import UploadImage from '../components/UploadImage'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as _actions from '../actions/form'
import {setBannerFile, cleanBannerFileList} from '../actions/fileList'
import {setContent} from '../actions/content'
import delegate from '../utils/Delegate'
let actions = Object.assign({}, _actions, {setBannerFile, cleanBannerFileList, setContent})
const confirm = Modal.confirm

class Edit extends Component{
    constructor() {
        super()
        this.handleBack = this.handleBack.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.changeCb = this.changeCb.bind(this)
    }

    componentWillMount() {
        const {id, cleanBannerFileList, setContent} = this.props
        console.log('get id:', id)
        setContent('')
        cleanBannerFileList()
        this.props.getForm(id)
    }

    componentDidMount() {
        document.querySelector('#title').focus()
        let self = this
        let back = document.querySelector('.ant-breadcrumb-link a')
        let exit = document.querySelector('#exit')
        let menu = document.querySelector('.ant-menu')
        if (!back) return
        back.onclick = e => {
            this.handleBack(e)
        }
        exit.onclick = e => {
            if (document.querySelector('.ant-breadcrumb-link a')) this.handleBack(e, 'logout.do')
        }
        delegate(menu, 'a', 'click', function (e) {
            if (document.querySelector('.ant-breadcrumb-link a')) self.handleBack(e, this.href)
        })
    }

    handleBack(e, href) {
        e.preventDefault()
        const modal = confirm({
            title: '注意',
            content: '你编辑的内容尚未保存，确定要返回吗？',
            onOk() {
                if (href) location.href = href
                else location.hash = '/' + location.hash.split('?')[0].replace(/(#|\/|edit)/g, '')
            }
        })
        window.onpopstate = () => {
            modal.destroy()
            window.onpopstate = null
        }
    }

    handleSubmit(e) {
        console.log('submit')
        e.preventDefault();
        const {id} = this.props
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                console.log('Errors in form!!!');
                return
            }
            console.log('Submit!!!');
            values.content = localStorage.getItem('content')
            values.cover = document.querySelector('#bannerUrl0').value
            values.publishUser = this.props.userName
            if (values.publishTime) values.publishTime = Number(values.publishTime.startOf('day').format('x'))
            values.summary = values.summary || (values.content || '')
                .replace(/(\u3000|\s|<.+?>|&nbsp;)/g, '')  // 替换空格
                .substring(0, 100)           // 取前100个字符
            if (id) values.id = id
            delete values.cover_pic
            delete values.bannerUrl0
            delete values.bannerUrl1
            delete values.bannerUrl2
            delete values.bannerUrl3
            let positionList = []
            Object.keys(values)
                .filter(k => {return k.match(/^position[0-9]$/)})
                .map(k => {
                    if (values[k]) {
                        let position = Number(k.match(/[0-9]/)[0])
                        let value = document.querySelector('#bannerUrl' + position).value
                        positionList.push({
                            position: position,
                            banner: value
                        })
                    }
                    delete values[k]
                    delete values[k + '_banner']
                })
            for (let k in values) if (!values[k]) values[k] = ''
            values.positionList = positionList
            this.props.submitForm(values)
        })
    }

    changeCb(position = 0) {
        let dom = document.querySelector('#bannerUrl' + position)
        dom.focus()
        dom.value = this.props.banner[position].url
    }

    shouldComponentUpdate() {
        if (!window.updateUrl) {
            window.updateUrl = true
            return false
        }
        return true
    }

    render() {
        console.log('----render')
        let {getFieldDecorator} = this.props.form
        const {defaultValues, result, cleanForm, setContent, banner} = this.props

        if (result) {
            if (result.retcode === -9999) error('提交失败', '请检查您的网络并重试')
            else if (result.retcode === -3) location.href = result.retmsg
            else if (result.retcode !== 0) error('提交失败', result.retmsg || '服务器错误')
            else success()
            this.props.cleanResult()
        }

        if (Object.keys(defaultValues).length > 0) {
            let _defaultValues = Object.assign({}, defaultValues, {
                publishTime: moment(moment(defaultValues.publishTime) || moment(), 'YYYY-MM-DD')
            })

            _defaultValues.type = String(_defaultValues.type)
            let position = _defaultValues.position
            _defaultValues['position' + position] = true
            _defaultValues['position' + position + '_banner'] = _defaultValues.banner
            if (_defaultValues.content) {
                setContent(_defaultValues.content)
            }
            this.props.form.setFieldsValue(_defaultValues)
            if (_defaultValues.banner)
                this.props.setBannerFile({
                    uid: -1,
                    name: 'banner.png',
                    status: 'done',
                    url: _defaultValues.banner,
                    thumbUrl: _defaultValues.banner
                }, position)
            if (_defaultValues.cover)
                this.props.setBannerFile({
                    uid: -1,
                    name: 'cover.png',
                    status: 'done',
                    url: _defaultValues.cover,
                    thumbUrl: _defaultValues.cover
                }, 0)

            cleanForm()
        }

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 17 }
        }

        return (
            <Form horizontal>
                <FormItem
                    {...formItemLayout}
                    label='标题'
                    hasFeedback
                >
                    {getFieldDecorator('title', {
                        rules: [
                            {
                                required: true,
                                transform(value) {
                                    return value.replace(/\u3000|\s/g, '')
                                },
                                message: '请输入标题'
                            },
                            { max: 30, message: '标题文字请控制在30个字以内' }
                        ]
                    })(
                        <Input placeholder="请输入标题，标题文字请控制在30个字以内" />
                    )}
                </FormItem>

                <FormItem className="ant-form-item-content"
                    {...formItemLayout}
                    label="正文"
                    hasFeedback
                >
                    {getFieldDecorator('content')(
                        <WangEditor />
                    )}
                </FormItem>

                <FormItem className="ant-form-item-banner"
                    {...formItemLayout}
                    label="上传新闻封面"
                >
                    {getFieldDecorator('cover_pic')(
                        <div>
                            <UploadImage type="banner" changeCb={this.changeCb} beforeCb={error} errorCb={error} />
                            <span>必填。上传图片建议尺寸：310px*180px。支持格式png、jpeg、jpg、gif</span>
                        </div>
                    )}
                </FormItem>

                <FormItem className="ant-form-item-t-fake"
                    {...formItemLayout}
                    label="上传新闻封面url"
                    hasFeedback
                >
                    {getFieldDecorator('bannerUrl0', {
                        rules: [
                            {
                                required: true,
                                transform(value) {
                                    return (value || '').replace(/undefined/g, '')
                                },
                                message: '请上传新闻图片'
                            }
                        ],
                        validateTrigger: 'onBlur',
                        initialValue: (banner[0] || {url: null}).url
                    })(
                        <Input className="banner-url-0" banner={banner} />
                    )}
                </FormItem>

                <FormItem
                    className="ant-form-item-textarea"
                    {...formItemLayout}
                    label="摘要"
                    hasFeedback
                >
                    {getFieldDecorator('summary', {
                        rules: [
                            {max: 150, message: '摘要请控制在150个字符以内'}
                        ]
                    })(
                        <Input
                            type="textarea"
                            placeholder="选填，如果不填写，则会默认抓取正文的前100字"
                            autosize={{
                                minRows: 5,
                                maxRows: 5
                            }}
                        />
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="新闻类型"
                >
                    {getFieldDecorator('type', {
                        rules: [
                            { required: true, message: '请选择新闻类型' }
                        ]
                    })(
                        <Select placeholder="请选择新闻类型" style={{ width: '100%' }}>
                            <Option value="1">合作动态</Option>
                            <Option value="2">行业资讯</Option>
                        </Select>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="推广广告位"
                >
                    {getFieldDecorator('position1', {
                        valuePropName: 'checked'
                    })(
                        <Checkbox className="official-banner">官网banner</Checkbox>
                        )}
                    {getFieldDecorator('position2', {
                        valuePropName: 'checked'
                    })(
                        <Checkbox className="information-banner">首页资讯推荐</Checkbox>
                        )}
                    {getFieldDecorator('position3', {
                        valuePropName: 'checked'
                    })(
                        <Checkbox className="information-recommand">行业资讯banner</Checkbox>
                    )}
                </FormItem>

                <FormItem
                    className={document.querySelector('.official-banner input:checked')
                        ? 'ant-form-item-banner'
                        : 'ant-form-item-banner display-none'}
                    {...formItemLayout}
                          label="上传官网banner"
                >
                    {getFieldDecorator('position1_banner')(
                        <div>
                            <UploadImage type="banner" position="1" changeCb={this.changeCb} beforeCb={error} errorCb={error} />
                            <span>必填。上传图片建议尺寸：310px*180px。支持格式png、jpeg、jpg、gif</span>
                        </div>
                    )}
                </FormItem>

                <FormItem
                    className={document.querySelector('.official-banner input:checked')
                        ? 'ant-form-item-t-fake'
                        : 'ant-form-item-t-fake display-none'}
                    {...formItemLayout}
                          label="上传官网bannerUrl"
                >
                    {getFieldDecorator('bannerUrl1', document.querySelector('.official-banner input:checked') ? {
                        rules: [
                            {
                                required: true,
                                transform(value) {
                                    return (value || '').replace(/undefined/g, '')
                                },
                                message: '请上传官网banner'
                            }
                        ],
                        validateTrigger: 'onBlur',
                        initialValue: (banner[1] || {url: null}).url
                    } : {})(
                        <Input className="banner-url-1" />
                    )}
                </FormItem>

                <FormItem
                    className={document.querySelector('.information-banner input:checked')
                        ? 'ant-form-item-banner'
                        : 'ant-form-item-banner display-none'}
                    {...formItemLayout}
                          label="上传首页资讯推荐"
                >
                    {getFieldDecorator('position2_banner')(
                        <div>
                            <UploadImage type="banner" position="2" changeCb={this.changeCb} beforeCb={error} errorCb={error} />
                            <span>必填。上传图片建议尺寸：310px*180px。支持格式png、jpeg、jpg、gif</span>
                        </div>
                    )}
                </FormItem>

                <FormItem
                    className={document.querySelector('.information-banner input:checked')
                        ? 'ant-form-item-t-fake'
                        : 'ant-form-item-t-fake display-none'}
                    {...formItemLayout}
                          label="上传首页资讯推荐Url"
                >
                    {getFieldDecorator('bannerUrl2', document.querySelector('.information-banner input:checked') ? {
                        rules: [
                            {
                                required: true,
                                transform(value) {
                                    return (value || '').replace(/undefined/g, '')
                                },
                                message: '请上传首页资讯推荐'
                            }
                        ],
                        validateTrigger: 'onBlur',
                        initialValue: (banner[2] || {url: null}).url
                    } : {})(
                        <Input id="bannerUrl2" />
                    )}
                </FormItem>

                <FormItem
                    className={document.querySelector('.information-recommand input:checked')
                        ? 'ant-form-item-banner'
                        : 'ant-form-item-banner display-none'}
                    {...formItemLayout}
                          label="上传行业资讯banner"
                >
                    {getFieldDecorator('position3_banner')(
                        <div>
                            <UploadImage type="banner" position="3" changeCb={this.changeCb} beforeCb={error} errorCb={error} />
                            <span>必填。上传图片建议尺寸：310px*180px。支持格式png、jpeg、jpg、gif</span>
                        </div>
                    )}
                </FormItem>

                <FormItem
                    className={document.querySelector('.information-recommand input:checked')
                        ? 'ant-form-item-t-fake'
                        : 'ant-form-item-t-fake display-none'}
                    {...formItemLayout}
                          label="上传行业资讯bannerUrl"
                >
                    {getFieldDecorator('bannerUrl3', document.querySelector('.information-recommand input:checked') ? {
                        rules: [
                            {
                                required: true,
                                transform(value) {
                                    return (value || '').replace(/undefined/g, '')
                                },
                                message: '请上传行业资讯banner'
                            }
                        ],
                        validateTrigger: 'onBlur',
                        initialValue: (banner[3] || {url: null}).url
                    } : {})(
                        <Input id="bannerUrl3" />
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="发布日期"
                >
                    {getFieldDecorator('publishTime', {
                        initialValue: moment()
                    })(
                        <DatePicker format="YYYY-MM-DD" />
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="来源"
                    hasFeedback
                >
                    {getFieldDecorator('source', {
                        rules: [
                            {max: 50, message: '来源请控制在50个字符以内'}
                        ]
                    })(
                        <Input placeholder="选填" />
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="来源URL"
                    hasFeedback
                >
                    {getFieldDecorator('sourceUrl', {
                        rules: [
                            {max: 200, message: '来源URL请控制在200个字符以内'}
                        ]
                    })(
                        <Input placeholder="选填" />
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="作者"
                    hasFeedback
                >
                    {getFieldDecorator('author', {
                        rules: [
                            {max: 50, message: '作者请控制在50个字符以内'}
                        ]
                    })(
                        <Input placeholder="选填" />
                    )}
                </FormItem>


                <FormItem
                    wrapperCol={{ span: 12, offset: 7 }}
                >
                    <Button type="primary" onClick={this.handleSubmit} id="submitBtn">提交</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button type="default" onClick={this.handleBack}>返回</Button>
                </FormItem>
            </Form>
        );
    }

}
const Option = Select.Option;
const createForm = Form.create;
const FormItem = Form.Item;

function success(title) {
    const modal = Modal.success({
        title: '修改成功',
        content: '数据已修改成功'
    })
    setTimeout(() => {
        modal.destroy()
        location.hash = '/' + location.hash.split('?')[0].replace(/(#|\/|edit)/g, '')
    }, 1000)
}

function error(title = '', content = '') {
    const modal = Modal.error({
        title: title,
        content: content
    })
    window.onpopstate = () => {
        modal.destroy()
        window.onpopstate = null
    }
}

let mapStateToProps = state => {
    return {
        banner: state.fileList.banner,
        userName: state.userInfo.name,
        id: state.__id__,
        defaultValues: state.formValues,
        result: state.submitResult,
        title: state.title
    }
}
let mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(Edit))
