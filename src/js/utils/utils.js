import DateFormat from './DateFormat'
import Object2Form from './Object2Form'
import {getDataUrl} from '../configs/url'
export {
    DateFormat,
    Object2Form
}

export function dateFormat(data){
    var date = new Date(data);
    let Y = date.getFullYear() + '年';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月';
    let  D = date.getDate() + '日';
    return Y+M+D
}
