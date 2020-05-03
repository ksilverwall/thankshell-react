import { connect } from 'react-redux'
import UserConfig from '../components/private/user/UserConfig.js'
import { setGroup } from '../actions'

const mapDispatchToProps = (dispatch) => {
  return {
    reloadMembers: () => {
      dispatch(setGroup(null))
    },
  }
}

const UpdateUser = connect(
  () => { return {} },
  mapDispatchToProps
)(UserConfig)

export default UpdateUser