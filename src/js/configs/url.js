import {tabNumber} from './map'

const HOST_DEV_URL = 'http://127.0.0.1:8001'
// const HOST_DEV_URL = 'http://howelljiang.kf0309.wcd.qq.com/webapp_health_portalcms'

const HOST_PRO_URL = location.href.match(/webapp_health_portalcms/) ? '/webapp_health_portalcms' : ''
export const HOST_URL = __DEV__ ? HOST_DEV_URL : HOST_PRO_URL

export const userInfoUrl = HOST_URL + '/userinfo.do'
export const getDataUrl = HOST_URL+'/getData.do'
export const changeShelfStatusUrl = (id, status) => HOST_URL + '/news/changeStatus.do?'+'newsId=' + id +'&status='+status
export const topShelfsUrl = (id,all) => HOST_URL + '/news/up.do?'+ 'newsId=' + id+'&all='+all
 export const logoutUrl = HOST_URL + '/logout.do'
export const uploadUrl = HOST_URL + (__DEV__ ? '/upload.do' : '/news/imgUpload.do')
export const uploadImgUrl = HOST_URL + (__DEV__ ? '/upload.do' : '/news/imgUpload4Editor.do')
export const submitUrl = HOST_URL + '/news/save.do'
export const getUrl = id => HOST_URL + '/news/get.do?newsId=' + id
