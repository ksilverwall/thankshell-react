import { connect } from 'react-redux';
import RevisionUpdateMessage from '../components/RevisionUpdateMessage.js';
import { setVersion } from '../actions'

const mapStateToProps = (state) => {
  return {
    remoteVersion: state.version,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRemoteVersion: (version) => {
      dispatch(setVersion(version))
    },
  }
};

const CheckRevision = connect(
  mapStateToProps,
  mapDispatchToProps
)(RevisionUpdateMessage);

export default CheckRevision;
