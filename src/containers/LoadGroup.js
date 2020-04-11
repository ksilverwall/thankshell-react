import { connect } from 'react-redux'
import {
  UserLoadingState,
  setGroup,
  setGroupLoadingState,
  setUser,
  setUserLoadingState,
} from '../actions'
import GroupsRouter from '../components/private/groups/GroupsRouter.js'

const mapStateToProps = (state, ownProps) => {
  let errorMessage = null
  if (state.userLoadingState === UserLoadingState.ERROR) {
    errorMessage = state.user.error
  }
  if (state.groupLoadingState === UserLoadingState.ERROR) {
    errorMessage = state.group.error
  }

  return {
    groupLoadingState: state.groupLoadingState,
    group: state.group,
    userLoadingState: state.userLoadingState,
    user: state.user,
    openRegisterUser: (state.user && state.user.status === 'UNREGISTERED'),
    errorMessage: errorMessage,
    unloaded: state.userLoadingState === UserLoadingState.NOT_LOADED || state.groupLoadingState === UserLoadingState.NOT_LOADED,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadGroup: async(groupId) => {
      dispatch(setGroupLoadingState(UserLoadingState.LOADING))
      dispatch(setUserLoadingState(UserLoadingState.LOADING))

      try {
        const group = await ownProps.api.getGroup(groupId)
        const user = await ownProps.api.getUser()

        dispatch(setGroup(group))
        dispatch(setUser(user))
        dispatch(setGroupLoadingState(UserLoadingState.LOADED))
        dispatch(setUserLoadingState(UserLoadingState.LOADED))
      } catch(err) {
        dispatch(setGroup({error: err.message}))
        dispatch(setUser({error: err.message}))
        dispatch(setGroupLoadingState(UserLoadingState.ERROR))
        dispatch(setUserLoadingState(UserLoadingState.ERROR))
      }
    },
  }
}

const LoadGroup = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupsRouter)

export default LoadGroup
