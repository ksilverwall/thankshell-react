import { connect } from 'react-redux'
import {
  UserLoadingState,
  setAdminToken,
  setAdminTokenLoadingState,
} from '../actions'
import GroupIndex from '../components/private/groups/GroupAdmin.js'

const mapStateToProps = (state, ownProps) => {
  return {
    adminTokenLoadingState: state.adminTokenLoadingState,
    adminToken: state.adminToken,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadAdminTransactions: (tokenName) => {
      dispatch(setAdminTokenLoadingState(UserLoadingState.LOADING))

      const loadToken = async(api, tokenName) => {
        return {
          holdings: await api.getHoldings(tokenName),
          allTransactions: await api.loadAllTransactions(tokenName)
        }
      }

      loadToken(ownProps.api, tokenName)
        .then(token => {
          dispatch(setAdminToken(token))
          dispatch(setAdminTokenLoadingState(UserLoadingState.LOADED))
        })
        .catch(err => {
          dispatch(setAdminToken({error: err.message}))
          dispatch(setAdminTokenLoadingState(UserLoadingState.ERROR))
        })
    },
    reloadAdminTransactions() {
      dispatch(setAdminTokenLoadingState(UserLoadingState.NOT_LOADED))
    },
  }
}

const LoadGroup = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupIndex)

export default LoadGroup
