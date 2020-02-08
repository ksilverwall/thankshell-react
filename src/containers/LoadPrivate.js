import { connect } from 'react-redux'
import PrivateArea from '../components/private/PrivateArea.js'
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
  }
}

const LoadPrivate = connect(
  mapStateToProps,
  mapDispatchToProps
)(PrivateArea)

export default LoadPrivate
