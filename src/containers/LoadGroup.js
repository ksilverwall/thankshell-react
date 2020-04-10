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
  return {
    groupLoadingState: state.groupLoadingState,
    group: state.group,
    userLoadingState: state.userLoadingState,
    user: state.user,
    openRegisterUser: (state.user && state.user.status === 'UNREGISTERED'),
    errorMessage: (state.userLoadingState === UserLoadingState.ERROR) ? state.user.error : null,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadGroup: (groupId) => {
      dispatch(setGroupLoadingState(UserLoadingState.LOADING))
      ownProps.api.getGroup(groupId)
        .then(group => {
          dispatch(setGroup(group))
          dispatch(setGroupLoadingState(UserLoadingState.LOADED))
        })
        .catch(err => {
          dispatch(setGroup({error: err.message}))
          dispatch(setGroupLoadingState(UserLoadingState.ERROR))
        })
    },
    loadUser: () => {
      dispatch(setUserLoadingState(UserLoadingState.LOADING))
      ownProps.api.getUser()
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

const LoadGroup = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupsRouter)

export default LoadGroup
