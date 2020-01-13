import { combineReducers } from 'redux'
import {
  SET_USER,
  SET_USER_LOADING_STATE,
  UserLoadingState
} from '../actions'

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
  userLoadingState,
  user,
})

export default appReducer
