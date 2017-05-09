import React, {Component} from 'react'
import {Router, Route, IndexRoute, hashHistory} from 'react-router'
//import {bindActionCreators} from 'redux'
//import {connect} from 'react-redux'
import Index from '../containers/Index'
import HomeBanner from '../containers/HomeBanner'
import HomeRecommend from '../containers/HomeRecommend'
import IndustryInformationBanner from '../containers/IndustryInformationBanner'
import LatestInformation from '../containers/LatestInformation'
import CooperationDynamics from'../containers/CooperationDynamics'
import IndustryNew from '../containers/IndustryNew'
import Add from '../containers/Add'
import Edit from '../containers/Edit'

export default class BreadcrumbRouter extends Component {
    render() {
        let add = (
            <div>
                <Route name="Add" breadcrumbName="添加资讯" path="add" component={Add} />
                <Route name="Edit" breadcrumbName="编辑资讯" path="edit" component={Edit} />
            </div>
        )
        return (
            <Router history={hashHistory}>
                <Route path="/" component={Index}>
                    <IndexRoute name="Index" breadcrumbName="主页" path="home-banner" component={HomeBanner} />
                    <Route name="HomeBanner" breadcrumbName="首页banner" path="home-banner" component={HomeBanner}>{add}</Route>
                    <Route breadcrumbName="首页推荐" path="home-recommend" component={HomeRecommend}>{add}</Route>
                    <Route breadcrumbName="行业资讯banner" path="industry-information-banner" component={IndustryInformationBanner}>{add}</Route>
                    <Route breadcrumbName="最新资讯" path="latest-information" component={LatestInformation}>{add}</Route>
                    <Route breadcrumbName="合作动态" path="cooperation-dynamics" component={CooperationDynamics}>{add}</Route>
                    <Route breadcrumbName="行业资讯" path="industry-news" component={IndustryNew}>{add}</Route>
                </Route>
            </Router>
        )
    }
}


