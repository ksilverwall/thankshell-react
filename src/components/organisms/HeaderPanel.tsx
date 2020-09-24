import React from 'react';
import styles from './HeaderPanel.module.css';
import PersonIcon from 'components/atoms/PersonIcon';
import { useHistory } from 'react-router-dom';

interface PropTypes {
  groupId: string,
  groupName: string,
  logoUri: string,
};

export default (props: PropTypes) => {
  const history = useHistory();

  return (
    <div className={styles.container}>
      <img className={styles.logo} src={props.logoUri} alt="group-logo" />
      <p className={styles.text}>{props.groupName}</p>
      <div className={styles.user} onClick={()=>{history.push(`/groups/${props.groupId}/user`)}}>
        <PersonIcon width="32px" height="32px"/>
      </div>
    </div>
  )
};
