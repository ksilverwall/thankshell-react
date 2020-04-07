import { connect } from 'react-redux'
import UserRegisterForm from '../components/private/UserRegisterForm.js'
import {
  UserLoadingState,
  setUserLoadingState,
  setCreatingUserError,
} from '../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    userRegisterError: state.userRegisterError,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    registerUser: async(userId) => {
      dispatch(setUserLoadingState(UserLoadingState.SAVING))
      ownProps.api.createUser(userId)
        .then(() => {
          dispatch(setCreatingUserError(null))
          dispatch(setUserLoadingState(UserLoadingState.NOT_LOADED))
        })
        .catch(err => {
          dispatch(setCreatingUserError(err.message))
          dispatch(setUserLoadingState(UserLoadingState.ERROR))
        })
    },
  }
}

const RegisterUser = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserRegisterForm)

export default RegisterUser
