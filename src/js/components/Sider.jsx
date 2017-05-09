import React, {Component} from 'react'
import {Menu, Icon} from 'antd'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as actions from '../actions/tab'

const SubMenu = Menu.SubMenu

class Sider extends Component {
    constructor(props) {
        super()
        this.state = {openKeys: props.tab < 3 ? ['sub2'] : ['sub1']}
        this.handleClick = this.handleClick.bind(this)
        this.onOpenChange = this.onOpenChange.bind(this)
        this.getKeyPath = this.getKeyPath.bind(this)
    }
    handleClick(e) {
        //this.setState({current: e.key});
        this.props.setTab(e.key)
    }
    onOpenChange(openKeys) {
        const latestOpenKey = openKeys.find(key => !(this.state.openKeys.indexOf(key) > -1))
        this.setState({openKeys: this.getKeyPath(latestOpenKey)})
    }
    getKeyPath(key) {
        const map = {
            sub1: ['sub1'],
            sub2: ['sub2']
        };
        return map[key] || []
    }
    render() {
        return (
            <Menu
                mode="inline"
                openKeys={this.state.openKeys}
                selectedKeys={[this.props.tab]}
                style={{width: 240}}
                onOpenChange={this.onOpenChange}
                onClick={this.handleClick}
            >
                <Menu.Item key="3"><Link to="/latest-information"><span><Icon type="mail" /><span>最新资讯(all)</span></span></Link></Menu.Item>
                <SubMenu key="sub1" title={<span><Icon type="appstore" /><span >资讯类型</span></span>}>
                    <Menu.Item key="4"><Link to="/cooperation-dynamics"><span>合作动态</span></Link></Menu.Item>
                    <Menu.Item key="5"><Link to="/industry-news">行业资讯</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title={<span><Icon type="mail" /><span >推广广告位</span></span>}>
                    <Menu.Item key="0"><Link to="/home-banner"><span>首页banner</span></Link></Menu.Item>
                    <Menu.Item key="1"><Link to="/home-recommend"><span>首页推荐</span></Link></Menu.Item>
                    <Menu.Item key="2"><Link to="/industry-information-banner"><span className="menu-font">行业资讯banner</span></Link></Menu.Item>
                </SubMenu>
            </Menu>
        )
    }
}

let mapStateToProps = state => {
    return {
        tab: state.tab
    }
}
let mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Sider)
