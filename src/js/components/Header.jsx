import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as actions from '../actions/userInfo'
import {logoutUrl} from '../configs/url'
import logo from './logo.png';
class Header extends Component {
    componentDidMount() {
        this.props.getUserInfo()
    }

    render() {
        var img = document.createElement('img');
        const {name} = this.props.userInfo
        return (
            <header>
                <img className="logo" src={logo}/>
                <h1>微信医保支付-运营配置平台</h1>
                <div>
                    <p>{name}</p>
                    <a id="exit" href={logoutUrl}>退出</a>
                </div>
            </header>
        )
    }
}

let mapStateToProps = state => {
    return {
        userInfo: state.userInfo
    }
}
let mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Header)
