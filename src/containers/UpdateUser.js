import { connect } from 'react-redux'
import UserConfig from '../components/private/user/UserConfig.js'
import {
  UserLoadingState,
  setGroupLoadingState,
} from '../actions'

const mapDispatchToProps = (dispatch) => {
  return {
    reloadMembers: () => {
      dispatch(setGroupLoadingState(UserLoadingState.NOT_LOADED))
    },
  }
}

const UpdateUser = connect(
  () => { return {} },
  mapDispatchToProps
)(UserConfig)

export default UpdateUser