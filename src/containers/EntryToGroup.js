import { connect } from 'react-redux'
import GroupEntry from '../components/private/groups/GroupEntry.js'
import { setGroup } from '../actions'

const mapDispatchToProps = (dispatch) => {
  return {
    onEntry: () => {
      dispatch(setGroup(null))
    },
  }
}

const EntryToGroup = connect(
  () => { return {} },
  mapDispatchToProps
)(GroupEntry)

export default EntryToGroup
