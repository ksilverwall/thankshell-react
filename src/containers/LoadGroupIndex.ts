import { connect } from 'react-redux'
import { setToken } from '../actions'
import GroupIndex from '../components/private/groups/GroupIndex'

const mapStateToProps = (state) => {
  return {
    token: state.group.token,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setToken: (data) => {
      dispatch(setToken(data))
    },
  }
}

const LoadGroup = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupIndex)

export default LoadGroup
