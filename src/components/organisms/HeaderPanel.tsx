import React from 'react';
import PersonIcon from 'components/atoms/PersonIcon';
import styles from './HeaderPanel.module.css';
import MemberSettingsView from './MemberSettingsView';
import ModalOpenButton from './ModalOpenButton';

interface PropTypes {
  groupId: string,
  groupName: string,
  logoUri: string,
};

export default (props: PropTypes) => {
  // FIXME: implement here
  const memberId = 'DUMMY_MEMBER_ID'
  const memberName = 'DUMMY_MEMBER_NAME';
  const onLogout = () => console.log('not implemented');
  const onUpdateMemberName = () => console.log('not implemented');

  return (
    <div className={styles.container}>
      <img className={styles.logo} src={props.logoUri} alt="group-logo" />
      <p className={styles.text}>{props.groupName}</p>
      <ModalOpenButton
        className={styles.user} 
        buttonElement={<PersonIcon width="32px" height="32px"/>}
        modalElement={
          <MemberSettingsView
            memberId={memberId}
            memberName={memberName}
            onUpdateMemberName={onUpdateMemberName}
            onLogout={onLogout}
          />
        }
      />
    </div>
  )
};
