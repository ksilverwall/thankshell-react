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
    groupLoadingErrorMessage: errorMessage,
    groupLoadingState: state.groupLoadingState,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setUser: (user) => {
      dispatch(setUser(user))
    },
    loadGroup: async(api, groupId) => {
      dispatch(setGroupLoadingState(UserLoadingState.LOADING))

      try {
        const group = await api.getGroup(groupId)

        dispatch(setGroup(group))
        dispatch(setGroupLoadingState(UserLoadingState.LOADED))
      } catch(err) {
        dispatch(setGroup({error: err.message}))
        dispatch(setGroupLoadingState(UserLoadingState.ERROR))
      }
    },
  }
}

const LoadGroup = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupsRouter)

export default LoadGroup
