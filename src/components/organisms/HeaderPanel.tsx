import React from 'react';
import styles from './HeaderPanel.module.css';
import PersonIcon from 'components/atoms/PersonIcon';

interface PropTypes {
  groupName: string,
  logoUri: string,
};

export default (props: PropTypes) => (
  <div className={styles.container}>
    <img className={styles.logo} src={props.logoUri} alt="group-logo" />
    <p className={styles.text}>{props.groupName}</p>
    <div className={styles.user}>
      <PersonIcon width="32px" height="32px"/>
    </div>
  </div>
);
