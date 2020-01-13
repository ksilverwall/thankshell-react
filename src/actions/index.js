export const SET_USER = 'SET_USER'
export const SET_USER_LOADING_STATE = 'SET_USER_LOADING_STATE'

export const UserLoadingState = {
  NOT_LOADED: 'NOT_LOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
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
