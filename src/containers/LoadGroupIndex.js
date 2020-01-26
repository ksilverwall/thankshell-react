import { connect } from 'react-redux'
import {
  setUser,
  UserLoadingState,
  setUserLoadingState,
  setGroup,
  setGroupLoadingState,
  setToken,
  setTokenLoadingState,
} from '../actions'
import GroupIndex from '../GroupIndex'

const mapStateToProps = (state, ownProps) => {
  return {
    userLoadingState: state.userLoadingState,
    user: state.user,
    groupLoadingState: state.groupLoadingState,
    group: state.group,
    tokenLoadingState: state.tokenLoadingState,
    token: state.token,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadUser: (api) => {
      dispatch(setUserLoadingState(UserLoadingState.LOADING))
      api.getUser()
        .then(user => {
          dispatch(setUser(user))
          dispatch(setUserLoadingState(UserLoadingState.LOADED))
        })
        .catch(err => {
          dispatch(setUser({error: err.message}))
          dispatch(setUserLoadingState(UserLoadingState.ERROR))
        })
    },
    loadGroup: (api, groupId) => {
      dispatch(setGroupLoadingState(UserLoadingState.LOADING))
      api.getGroup(groupId)
        .then(group => {
          dispatch(setGroup(group))
          dispatch(setGroupLoadingState(UserLoadingState.LOADED))
        })
        .catch(err => {
          dispatch(setGroup({error: err.message}))
          dispatch(setGroupLoadingState(UserLoadingState.ERROR))
        })
    },
    loadTransactions: (api, tokenName, userId) => {
      dispatch(setTokenLoadingState(UserLoadingState.LOADING))

      const loadToken = async(api, tokenName, userId) => {
        return {
          holding: await api.getHolding(tokenName, userId),
          transactions: await api.loadTransactions(tokenName, userId)
        }
      }

      loadToken(api, tokenName, userId)
        .then(token => {
          dispatch(setToken(token))
          dispatch(setTokenLoadingState(UserLoadingState.LOADED))
        })
        .catch(err => {
          dispatch(setToken({error: err.message}))
          dispatch(setTokenLoadingState(UserLoadingState.ERROR))
        })
    },
    setTokenLoadingState(state) {
      dispatch(setTokenLoadingState(state))
    },
  }
}

const LoadGroup = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupIndex)

export default LoadGroup
