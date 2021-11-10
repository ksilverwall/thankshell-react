import React from 'react';
import PersonIcon from 'components/atoms/PersonIcon';
import styles from './HeaderPanel.module.css';
import ModalOpenButton from './ModalOpenButton';

interface PropTypes {
  groupId: string,
  groupName: string,
  logoUri: string,
  memberSettingsView: JSX.Element,
};

const HeaderPanel = (props: PropTypes) => {
  return (
    <div className={styles.container}>
      <img className={styles.logo} src={props.logoUri} alt="group-logo" />
      <p className={styles.text}>{props.groupName}</p>
      <ModalOpenButton
        className={styles.user} 
        buttonElement={<PersonIcon width="32px" height="32px"/>}
        modalElement={props.memberSettingsView}
      />
    </div>
  )
};

export default HeaderPanel;
