import { connect } from 'react-redux'
import {
  setGroup,
  setUser,
} from '../actions'
import GroupsRouter from '../components/private/groups/GroupsRouter'

const mapStateToProps = (state) => {
  return {
    user: state.user,
    group: state.group,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => {
      dispatch(setUser(user))
    },
    setGroup:(group) => {
      dispatch(setGroup(group))
    },
  }
}

const LoadGroup = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupsRouter)

export default LoadGroup
