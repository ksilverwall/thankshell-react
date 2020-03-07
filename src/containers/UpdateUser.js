import { connect } from 'react-redux'
import UserConfig from '../components/private/user/UserConfig.js'
import {
  UserLoadingState,
  setUserLoadingState,
} from '../actions'

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateUser: (user) => {
      dispatch(setUserLoadingState(UserLoadingState.SAVING))
      ownProps.api.updateUser(ownProps.user.user_id, user)
        .then(() => {
          dispatch(setUserLoadingState(UserLoadingState.NOT_LOADED))
        })
        .catch(err => {
          dispatch(setUserLoadingState(UserLoadingState.ERROR))
        })
    },
  }
}

const UpdateUser = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserConfig)

export default UpdateUser