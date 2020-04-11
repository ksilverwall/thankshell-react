import { connect } from 'react-redux'
import GroupEntry from '../components/private/groups/GroupEntry.js'
import {
  setUserLoadingState,
  UserLoadingState,
} from '../actions'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onEntry: () => {
      dispatch(setUserLoadingState(UserLoadingState.NOT_LOADED))
    },
  }
}

const EntryToGroup = connect(
  () => {},
  mapDispatchToProps
)(GroupEntry)

export default EntryToGroup
