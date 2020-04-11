import { connect } from 'react-redux'
import GroupEntry from '../components/private/groups/GroupEntry.js'
import {
  setCreatingUserError,
  setUserLoadingState,
  UserLoadingState,
} from '../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    userRegisterError: state.userRegisterError,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    entry: async(memberId, hash) => {
      dispatch(setUserLoadingState(UserLoadingState.SAVING))
      ownProps.api.entryToGroup("sla", memberId, hash)
        .then(() => {
          dispatch(setCreatingUserError(null))
          dispatch(setUserLoadingState(UserLoadingState.NOT_LOADED))
        })
        .catch(err => {
          dispatch(setCreatingUserError(err.message))
          dispatch(setUserLoadingState(UserLoadingState.ERROR))
        })
    },
  }
}

const EntryToGroup = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupEntry)

export default EntryToGroup
