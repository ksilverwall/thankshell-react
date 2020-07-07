import { connect } from 'react-redux'
import { setToken } from '../actions'
import GroupAdmin from '../components/private/groups/GroupAdmin'

const mapStateToProps = (state) => {
  return {
    token: state.group.token,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setToken: (data) => {
      dispatch(setToken(data))
    },
    reloadAdminTransactions() {
      dispatch(setToken(null))
    },
  }
}

const LoadGroup = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupAdmin)

export default LoadGroup
