import { connect } from 'react-redux'
import UserRoute from '../UserRoute'
import {
  setUser,
  UserLoadingState,
  setUserLoadingState,
} from '../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    userLoadStatus: state.userLoadingState,
    user: state.user,
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

const LoadUser = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserRoute)

export default LoadUser
