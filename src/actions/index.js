export const SET_USER = 'SET_USER'
export const SET_USER_LOADING_STATE = 'SET_USER_LOADING_STATE'
export const SET_USER_REGISTER_ERROR = 'SET_USER_REGISTER_ERROR'
export const SET_GROUP = 'SET_GROUP'
export const SET_GROUP_LOADING_STATE = 'SET_GROUP_LOADING_STATE'

export const UserLoadingState = {
  NOT_LOADED: 'NOT_LOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  SAVING: 'SAVING',
  ERROR: 'ERROR',
}

export function setUser(user) {
  return { type: SET_USER, user }
}

export function setUserLoadingState(state) {
  return {
    type: SET_USER_LOADING_STATE,
    state: state,
  }
}

export function setCreatingUserError(message) {
  return {
    type: SET_USER_REGISTER_ERROR,
    message: message,
  }
}

export function setGroup(group) {
  return { type: SET_GROUP, group: group }
}

export function setGroupLoadingState(state) {
  return {
    type: SET_GROUP_LOADING_STATE,
    state: state,
  }
}
