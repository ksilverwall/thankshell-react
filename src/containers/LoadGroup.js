import { connect } from 'react-redux'
import {
  UserLoadingState,
  setGroup,
  setGroupLoadingState,
  setUser,
  setUserLoadingState,
} from '../actions'
import GroupsRouter from '../components/private/groups/GroupsRouter.js'

const mapStateToProps = (state) => {
  let errorMessage = null
  if (state.userLoadingState === UserLoadingState.ERROR) {
    errorMessage = state.user.error
  }
  if (state.groupLoadingState === UserLoadingState.ERROR) {
    errorMessage = state.group.error
  }

  return {
    group: state.group,
    user: state.user,
    errorMessage: errorMessage,
    unloaded: state.userLoadingState === UserLoadingState.NOT_LOADED || state.groupLoadingState === UserLoadingState.NOT_LOADED,
    loading: state.userLoadingState === UserLoadingState.LOADING || state.groupLoadingState === UserLoadingState.LOADING,
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
