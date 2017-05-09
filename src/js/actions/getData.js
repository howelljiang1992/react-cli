import {GET_DATA, CHANGE_SHELF_STATUS, REFRESH_DATA, TOP_SHELF} from '../constants/Actions'
import {getDataUrl, changeShelfStatusUrl, topShelfsUrl} from '../configs/url'
import {Modal} from 'antd'
const error = Modal.error

function showErrorModal() {
    const modal = error({
        title: '网络错误',
        content: '请检查您的网络并重试'
    })
    window.onpopstate = () => {
        modal.destroy()
        window.onpopstate = null
    }
}

export function getData() {
    return dispatch => {
        return Fetch(getDataUrl)
            .then(res => {
                return res.json()
            })
            .then(data => {
                console.log(data)
                // if (data.retcode === -3) location.href = 'logout.do'
                if (data.data.total === 0) return
                dispatch({
                    type: GET_DATA,
                    data: data.data
                })
            })
            .catch(function (err) {
                console.error(err)
                showErrorModal()
            })
    }
}

export function refreshData(type) {
    return {
        type: REFRESH_DATA
    }
}

export function changeShelfStatus(id, status) {
    return dispatch => {
        return Fetch(changeShelfStatusUrl(id, status))
            .then(res => {
                return res.json()})
            .then(data => {
                    dispatch({
                type: CHANGE_SHELF_STATUS,
                data: data,
                id: id
            })})
            .catch(function(err) {
                showErrorModal()
        })
    }
}

export function topShelf(id,all) {
    return dispatch => {
        return Fetch(topShelfsUrl(id,all))
            .then(res => {return res.json()})
            .then(data => {dispatch({
                type: TOP_SHELF,
                data: data,
                id: id
            })})
            .catch(function(error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                showErrorModal()
            })
    }
}
