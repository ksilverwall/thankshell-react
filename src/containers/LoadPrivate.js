import { connect } from 'react-redux'
import PrivateContents from '../components/private/PrivateContents.js'
import {
  setUser,
  UserLoadingState,
  setUserLoadingState,
} from '../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    userLoadingState: state.userLoadingState,
    user: state.user,
    openRegisterUser: (state.user && state.user.status === 'UNREGISTERED'),
    errorMessage: (state.userLoadingState === UserLoadingState.ERROR) ? state.user.error : null,
    reloadUser: (state.userLoadingState === UserLoadingState.NOT_LOADED),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadUser: () => {
      dispatch(setUserLoadingState(UserLoadingState.LOADING))
      ownProps.api.getUser()
        .then(user => {
          dispatch(setUser(user))
          dispatch(setUserLoadingState(UserLoadingState.LOADED))
        })
        .catch(err => {
          dispatch(setUser({error: err.message}))
          dispatch(setUserLoadingState(UserLoadingState.ERROR))
        })
    },
  }
}

const LoadPrivate = connect(
  mapStateToProps,
  mapDispatchToProps
)(PrivateContents)

export default LoadPrivate
