import {SUBMIT_FORM, GET_FORM, CLEAN_RESULT, CLEAN_FORM, SUBMIT_ERROR} from '../constants/Actions'
import {submitUrl, getUrl} from '../configs/url'

export function submitForm(data) {
    return dispatch => {
        return Fetch(submitUrl, {
            headers: {
                'content-type': 'application/json'
            },
                 method: 'POST',
                 body: JSON.stringify(data)
        })
        .then(res => {return res.json()})
        .then(data => {
            dispatch({
                type: SUBMIT_FORM,
                data: data
            })
        })
        .catch(() => {
            dispatch({
                type: SUBMIT_ERROR
            })
        })
    }
}

export function getForm(id) {
    return dispatch => {
        return Fetch(getUrl(id))
            .then(res => {return res.json()})
            .then(data => {
                dispatch({
                    type: GET_FORM,
                    data: data
                })})
    }
}

export function cleanResult() {
    return {
        type: CLEAN_RESULT
    }
}

export function cleanForm() {
    return {
        type: CLEAN_FORM
    }
}

