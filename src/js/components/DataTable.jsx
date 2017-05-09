import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as _actions from '../actions/getData'
import {setId} from '../actions/id'
import {Table, Modal} from 'antd'
import {DateFormat, dateFormat,isOnline} from '../utils/utils'
import {r} from '../configs/map'

const confirm = Modal.confirm
let actions = Object.assign({}, _actions, {setId})

class DataTable extends Component {
    constructor() {
        super()
        this.state = {
            onShelf: 0
        }
        this.editHandle = this.editHandle.bind(this)
        this.shelfHandle = this.shelfHandle.bind(this)
        this.topHandle = this.topHandle.bind(this)
    }

    render() {
        // alert(JSON.stringify(this.props.data));
        const self = this
        const columns = [
            {
                title: '序号',
                dataIndex: 'idx',
                render(idx, data) {
                    return (
                        <span className={data.status === -1 ? 'data-number used':'data-number used'}>{idx}</span>
                    )
                }
            },
            {
                title: '新闻id',
                dataIndex: 'id',
                render(id, data) {
                    return (
                        <span className={data.status === -1 ? 'data-id disabled':'data-id used'}>{id}</span>
                    )
                }
            },
            {
                title: '标题',
                dataIndex: 'title',
                render(title,data) {
                    return (
                        <span className={data.status === -1 ? 'data-title disabled':'data-title used'} title={title}>{title}</span>
                    )
                }
            }, {
                title: '发布日期',
                dataIndex: 'publishTime',
                render(publishTime, data) {
                    return (
                        <span className={data.status === -1? 'data-date disabled' : 'data-date used'}>{dateFormat(publishTime)}</span>
                    )
                }
            }, {
                title: '状态',
                dataIndex: '',
                render(data) {
                    return (
                        <span className={data.status === -1 ? 'data-status disabled' : 'data-status used'}>
                            {(() => {
                                switch (data.status) {
                                    case -1: return '已下架'
                                    case  0: return '预发布'
                                    case  1: return '已发布'
                                    default: return
                                }
                            })()}
                        </span>
                    )
                }
            }, {
                title: '发布者',
                dataIndex: 'publishUser',
                render(publishUser,data){
                    return( <span className={data.status === -1 ? 'data-editor disabled':'data-editor used'}>{publishUser}</span>
                    )
                }
            }, {
                title: '操作',
                dataIndex: '',
                render(data) {
                    return (
                        <span>
                            <a className="operate-btn edit-btn" href="javascript:;" onClick={self.editHandle}>编辑</a>
                            <a className="operate-btn shelf-btn" href="javascript:;" onClick={self.shelfHandle}>{data.status === -1 ? '取消下架': '下架'}</a>
                            <a className="operate-btn top-btn" href="javascript:;" onClick={self.topHandle}>置顶</a>
                        </span>
                    )
                }
            }
        ]

        let {data} = this.props
        let total = data.length

        const pagination = {
            total: data.length,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                console.log('Current: ', current, '; PageSize: ', pageSize);
            },
            onChange(current) {
                console.log('Current: ', current);
            }
        }
        return (
            <Table columns={columns} dataSource={data} pagination={pagination} />
        )
    }

    componentDidMount() {
        this.props.refreshData()
        //this.props.getData(this.props.type)
        this.props.getData();
    }

    editHandle(e) {
            let id = Number(e.target.closest('tr').querySelectorAll('.data-id')[0].innerHTML)
            console.log('jump id:', id)
            this.props.setId(id)
            let hash = location.hash.split('?')[0].replace(/#\//, '')
            location.hash = '/' + hash + '/edit'
    }

    shelfHandle(e) {
        let id = Number(e.target.closest('tr').querySelectorAll('.data-id')[0].innerHTML)
        let text = e.target.closest('tr').querySelectorAll('.shelf-btn')[0].innerHTML
        let self = this
        let status = (text === '取消下架' ? 1 : -1)
        console.log('status', status);
        const modal = confirm({
            title: '操作',
            content: '是否确定' + text + '此条资讯？',
            onOk() {
                  self.props.changeShelfStatus(id, status);
            }
        })
        window.onpopstate = () => {
            modal.destroy()
            window.onpopstate = null
        }
    }

     topHandle(e) {
         let id = Number(e.target.closest('tr').querySelectorAll('.data-id')[0].innerHTML)
         let idx = Number(e.target.closest('tr').querySelectorAll('.data-number')[0].innerHTML)
         //console.log('idx',idx);
         console.log('type', this.props.type)
         if (idx !== 1) {
             let all = this.props.type === '3' ? 1 : 0
             this.props.topShelf(id, all)
         }
    }
}

let mapStateToProps = state => {
    return {
        data: state.getData,
        type: state.tab
    }
}

let mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataTable)//把action绑定到组件中,把数据绑定到组件中
