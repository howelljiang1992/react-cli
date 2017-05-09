import React, {Component} from 'react'
import {Link} from 'react-router'
import {Button} from 'antd'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as actions from '../actions/tab'

class AddBtn extends Component{
    constructor(props) {
        super(props)
    }

    render(){
       if (!this.props.text) return null
       return (
           <Link to={this.props.link} className={this.props.type === '3' ? 'add-btn' : 'display'}>
               <Button size="large">{this.props.text}</Button>
           </Link>
       )
    }
}

let mapStateToProps = state => {
    return {
        type: state.tab
    }
}
let mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AddBtn)
