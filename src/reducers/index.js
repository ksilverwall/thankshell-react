import { combineReducers } from 'redux'
import {
  SET_USER,
  SET_GROUP,
  SET_TOKEN,
} from '../actions'

const user = (state = null, action) => {
  switch (action.type) {
    case SET_USER:
      return action.user
    default:
      return state
  }
}

const groupToken = (state = null, action) => {
  switch (action.type) {
    case SET_TOKEN:
      return action.transactions
    default:
      return state
  }
}

const group = (state = null, action) => {
  switch (action.type) {
    case SET_GROUP:
      return action.group
    default:
      if (state) {
        state.token = groupToken(state.token, action)
      }
      return state
  }
}

const token = (state = null, action) => {
  switch (action.type) {
    case SET_TOKEN:
      return action.transactions
    default:
      return state
  }
}

const appReducer = combineReducers({
  user,
  group,
  token,
})

export default appReducer
