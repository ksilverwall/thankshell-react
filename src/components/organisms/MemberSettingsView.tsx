import React from 'react';
import EditableText from 'components/molecules/EditableText';
import styles from './MemberSettingsView.module.css';


interface PropsType {
    memberId: string,
    memberName: string,
    onUpdateMemberName: (memberName: string) => void
    onLogout: () => void,
};

export default (props: PropsType) => {
  return (
    <div className={styles.area}>
      <label>ユーザー名</label>
      <EditableText value={props.memberName} onUpdate={props.onUpdateMemberName}/>
      <label>ID</label>
      <p className={styles.text}>{props.memberId}</p>
      <button className={styles.button} onClick={props.onLogout}>ログアウト</button>
    </div>
  );
};

