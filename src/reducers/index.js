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
      return {
        ...state,
        token: state ? groupToken(state.token, action) : null,
      }
  }
}

const appReducer = combineReducers({
  user,
  group,
})

export default appReducer
