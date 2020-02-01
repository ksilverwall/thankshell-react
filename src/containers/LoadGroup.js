import { connect } from 'react-redux'
import {
  UserLoadingState,
  setGroup,
  setGroupLoadingState,
} from '../actions'
import GroupsRouter from '../GroupsRouter'

const mapStateToProps = (state, ownProps) => {
  return {
    groupLoadingState: state.groupLoadingState,
    group: state.group,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
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
