import { combineReducers } from 'redux'
import {
  SET_USER,
  SET_USER_LOADING_STATE,
  SET_USER_REGISTER_ERROR,
  UserLoadingState
} from '../actions'

const userRegisterError = (state = null, action) => {
  switch (action.type) {
    case SET_USER_REGISTER_ERROR:
      return action.message
    default:
      return state
  }
}

const userLoadingState = (state = UserLoadingState.NOT_LOADED, action) => {
  switch (action.type) {
    case SET_USER_LOADING_STATE:
      return action.state
    default:
      return state
  }
}

const user = (state = null, action) => {
  switch (action.type) {
    case SET_USER:
      return action.user
    default:
      return state
  }
}

const appReducer = combineReducers({
  userRegisterError,
  userLoadingState,
  user,
})

export default appReducer
