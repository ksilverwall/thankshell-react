import { connect } from 'react-redux'
import GroupEntry from '../components/private/groups/GroupEntry.js'
import {
  setGroupLoadingState,
  UserLoadingState,
} from '../actions'

const mapDispatchToProps = (dispatch) => {
  return {
    onEntry: () => {
      dispatch(setGroupLoadingState(UserLoadingState.NOT_LOADED))
    },
  }
}

const EntryToGroup = connect(
  () => { return {} },
  mapDispatchToProps
)(GroupEntry)

export default EntryToGroup
