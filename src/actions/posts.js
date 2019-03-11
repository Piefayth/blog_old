import ActionTypes from '../constants/actionTypes'
import { createAction } from 'redux-actions'
import axios from 'axios'
import env from '../utils/env'


export const getPostSuccess = post => ({
    type: ActionTypes.GET_POST_SUCCESS,
    post
})

export const getPostError = error => ({
    type: ActionTypes.GET_POST_ERROR,
    error
})

export const getPost = (id) => (dispatch) => {
    let uri
    if (env.env === 'development') {
        uri = env.devUrl
    } else {
        uri = env.prodUrl
    }
    
    axios.get(`${uri}${id}.md`)
        .then(ok => (dispatch(getPostSuccess(ok.data))))
        .catch(error => (dispatch(getPostError(error))))
}

