import { connect } from 'react-redux'
import {
  UserLoadingState,
  setGroup,
  setGroupLoadingState,
  setUser,
} from '../actions'
import GroupsRouter from '../components/private/groups/GroupsRouter.js'

const mapStateToProps = (state) => {
  let errorMessage = null
  if (state.groupLoadingState === UserLoadingState.ERROR) {
    errorMessage = state.group.error
  }

  return {
    user: state.user,
    group: state.group,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
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
