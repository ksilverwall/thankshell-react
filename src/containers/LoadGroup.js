import { connect } from 'react-redux'
import {
  setUser,
  UserLoadingState,
  setUserLoadingState,
  setGroup,
  setGroupLoadingState,
} from '../actions'
import GroupsRouter from '../GroupsRouter'

const mapStateToProps = (state, ownProps) => {
  return {
    userLoadingState: state.userLoadingState,
    user: state.user,
    groupLoadingState: state.groupLoadingState,
    group: state.group,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadUser: (api) => {
      dispatch(setUserLoadingState(UserLoadingState.LOADING))
      api.getUser()
        .then(user => {
          dispatch(setUser(user))
          dispatch(setUserLoadingState(UserLoadingState.LOADED))
        })
        .catch(err => {
          dispatch(setUser({error: err.message}))
          dispatch(setUserLoadingState(UserLoadingState.ERROR))
        })
    },
    loadGroup: (api, groupId) => {
      dispatch(setGroupLoadingState(UserLoadingState.LOADING))
      api.getGroup(groupId)
        .then(group => {
          dispatch(setGroup(group))
          dispatch(setGroupLoadingState(UserLoadingState.LOADED))
        })
        .catch(err => {
          dispatch(setGroup({error: err.message}))
          dispatch(setGroupLoadingState(UserLoadingState.ERROR))
        })
    },
  }
}

const LoadGroup = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupsRouter)

export default LoadGroup
