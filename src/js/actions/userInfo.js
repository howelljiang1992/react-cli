import {GET_USERINFO} from '../constants/Actions'
import {userInfoUrl} from '../configs/url'

export function getUserInfo() {
    return dispatch => {
        return Fetch(userInfoUrl)
            .then(res => {return res.json()})
            .then(data => {
               // alert(JSON.stringify(data))
                // if (data.retcode === -3) location.href = 'logout.do'
                dispatch({
                    type: GET_USERINFO,
                    data: data
                })
            })
    }
}
