import {GET_DATA, CHANGE_SHELF_STATUS, REFRESH_DATA, TOP_SHELF} from '../constants/Actions'
import {Table, Modal} from 'antd'
const confirm = Modal.confirm

export function getData(state = [], action) {
    switch (action.type) {
        case GET_DATA:
            let _data = action.data.map((d, idx) => {
                d.idx = idx + 1
                return d
            })
            return [...state, ..._data]
        case CHANGE_SHELF_STATUS:
            if (action.data.retcode===0) {
                let s = state.filter(s => {return s.id === action.id})[0];
                s.status = Number(action.data.data)
                return [...state]
            } else {
                switch (action.data.retcode){
                    case -1:
                    {confirm({
                        title: '提示',
                        content: '系统或数据异常',
                        onOk() {
                        }
                    })
                    return state}
                    case -2:
                    {confirm({
                        title: '提示',
                        content: '抱歉，您没有权限 ',
                        onOk() {
                        }
                    })
                    return state}
                    case -3:
                    { confirm({
                        title: '提示',
                        content: '当前登录失效 ',
                        onOk() {
                        }
                    })
                    return state}
                    default: return state
                }
            }
        case TOP_SHELF:
            if (action.data.retcode===0) {
                let i
                for (i in state) if (state[i].id === action.id) break

                let t=state[0]
                state[0]=state[i]
                state.splice(i,1)
                state.splice(1,0,t)

                for (let k = 0; k <= i; k++) state[k].idx = k + 1;

                //for(j=1;j<i;j++){
                //    let temp=state[j]
                //    state[j]=state[j-1]
                //    state[j-1]=temp
                //}
                //let dix=0
                //for(j in state) state[i].idx=dix+1

                //t = state[i].idx
                //state[i].idx = state[0].idx
                //state[0].idx = t
                return [...state]

            }else {
                switch (action.data.retcode){
                    case -1:
                    {confirm({
                        title: '提示',
                        content: '系统或数据异常',
                        onOk() {
                        }
                    })
                    return state}
                    case -2:
                    {confirm({
                        title: '提示',
                        content: '抱歉，您没有权限 ',
                        onOk() {
                        }
                    })
                    return state}
                    case -3:
                    { confirm({
                            title: '提示',
                            content: '当前登录失效 ',
                            onOk() {
                            }
                        })
                    return state}
                    default: return state
                }
            }
        case REFRESH_DATA:
            return []
        default:
            return state
    }
}
