export const SET_USER = 'SET_USER'
export const SET_GROUP = 'SET_GROUP'
export const SET_TOKEN = 'SET_TOKEN'

export function setUser(user) {
  return { type: SET_USER, user }
}

export function setGroup(group) {
  return { type: SET_GROUP, group: group }
}

export function setToken(transactions) {
  return { type: SET_TOKEN, transactions }
}
