import { connect } from 'react-redux'
import {
  UserLoadingState,
  setToken,
  setTokenLoadingState,
} from '../actions'
import GroupIndex from '../components/private/groups/GroupIndex.js'

const mapStateToProps = (state, ownProps) => {
  return {
    tokenLoadingState: state.tokenLoadingState,
    token: state.token,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadTransactions: (tokenName, userId) => {
      dispatch(setTokenLoadingState(UserLoadingState.LOADING))

      const loadToken = async(api, tokenName, userId) => {
        return {
          holding: await api.getHolding(tokenName, userId),
          transactions: await api.loadTransactions(tokenName, userId)
        }
      }

      loadToken(ownProps.api, tokenName, userId)
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
