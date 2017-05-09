import { combineReducers } from 'redux'
import {userInfo} from './userInfo'
import {getData} from './getData'
import {tab} from './tab'
import {title} from './title'
import {fileList} from './fileList'
import {submitResult, formValues} from './form'
import {__id__} from './id'
import {content} from './content'


export default combineReducers({
    userInfo,
    getData,
    tab,
    fileList,
    submitResult,
    __id__,
    formValues,
    content,
    title
})
