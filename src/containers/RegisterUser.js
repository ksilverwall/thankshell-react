import { connect } from 'react-redux'
import UserRegister from '../UserRegister'
import {
  setUser,
  UserLoadingState,
  setUserLoadingState,
  setCreatingUserError,
} from '../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    userRegisterError: state.userRegisterError,
    userLoadStatus: state.userLoadingState,
    user: state.user,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    registerUser: async(api, userId) => {
      dispatch(setUserLoadingState(UserLoadingState.SAVING))
      api.createUser(userId)
        .then(() => {
          dispatch(setCreatingUserError(null))
          dispatch(setUserLoadingState(UserLoadingState.NOT_LOADED))
        })
        .catch(err => {
          dispatch(setCreatingUserError(err.message))
        })
    },
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

const RegisterUser = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserRegister)

export default RegisterUser
