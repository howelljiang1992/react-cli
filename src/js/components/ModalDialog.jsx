import React, {Component} from 'react'
import { Modal, Button } from 'antd'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as actions from '../actions/fileList'

class ModalDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {visible: false}
        this.handleOk = this.handleOk.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.showModal = this.showModal.bind(this)
    }

    showModal() {
        this.setState({
            visible: true
        })
    }

    handleOk() {
        this.setState({
            visible: false
        })
        this.props.OKCb()
        this.props.cleanArticleFileList()
    }

    handleCancel() {
        this.props.cleanArticleFileList('article')
        this.setState({
            visible: false
        })
    }

    render() {
        return (
            <div>
                <span onClick={this.showModal}>{this.props.triggerElm}</span>
                <Modal title="Basic Modal" visible={this.state.visible}
                       onOk={this.handleOk} onCancel={this.handleCancel}
                >
                    {this.props.children}
                </Modal>
            </div>
        )
    }
}

let mapStateToProps = state => {
    return {
        fileList: state.fileList
    }
}
let mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ModalDialog)