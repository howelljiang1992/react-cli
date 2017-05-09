import React, {Component} from 'react';
import Header from '../components/Header'
import Sider from '../components/Sider'
import {Breadcrumb} from 'antd'
import Footer from '../components/Footer'
import AddBtn from '../components/AddBtn'
import {r} from '../configs/map'

export default props => {
    let hash = location.hash.split('?')[0].replace(/#\//, '')
    if (!hash) location.hash = '#/home-banner'
    let newHash = '/' + hash + '/add'

    return (
        <div>
            <Header />
            <Breadcrumb {...props} />
            {
                hash.indexOf('add') === -1 && hash.indexOf('edit') === -1 ?
                <AddBtn text="添加资讯" link={newHash} /> :
                ''
            }
            <div className="main-wrapper">
                <Sider />
                <section className="main-container">
                    {props.children}
                </section>
            </div>
            <Footer />
        </div>
    )
}
