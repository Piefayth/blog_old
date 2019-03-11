import ActionTypes from '../constants/actionTypes'
import { createAction } from 'redux-actions'
import axios from 'axios'


export const getPostSuccess = post => ({
    type: ActionTypes.GET_POST_SUCCESS,
    post
})

export const getPostError = error => ({
    type: ActionTypes.GET_POST_ERROR,
    error
})

export const getPost = (id) => (dispatch) => {
    axios.get(`/static/posts/${id}.md`)
        .then(ok => (dispatch(getPostSuccess(ok.data))))
        .catch(error => (dispatch(getPostError(error))))
}

