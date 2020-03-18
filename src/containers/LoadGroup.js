import { connect } from 'react-redux'
import {
  UserLoadingState,
  setGroup,
  setGroupLoadingState,
} from '../actions'
import GroupsRouter from '../components/private/groups/GroupsRouter.js'

const mapStateToProps = (state, ownProps) => {
  console.log(state)
  return {
    groupLoadingState: state.groupLoadingState,
    group: state.group,
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
  }
}

const LoadGroup = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupsRouter)

export default LoadGroup
