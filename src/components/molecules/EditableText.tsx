import React, { useState } from 'react';
import EditIcon from 'components/atoms/EditIcon';
import SaveIcon from 'components/atoms/SaveIcon';
import styles from './EditableText.module.css';

interface PropsType {
  value: string,
  onUpdate: (value: string) => void,
};

export default (props: PropsType) => {
  const [newValue, setNewValue] = useState<string>(props.value);
  const [isEditting, setEditting] = useState<boolean>(false);
  const onSave = () => {
    setEditting(false);
    if (props.value !== newValue) {
      props.onUpdate(newValue);
    }
  };

  return (
    <div className={isEditting ? styles.editting : styles.const}>
      <input
        className={styles.text}
        type='text'
        readOnly={!isEditting}
        value={newValue}
        onChange={(event)=>setNewValue(event.target.value)}
      />
      <div className={styles.icon}>
        {
          isEditting ? (
            <SaveIcon width="24px" height="24px" onClick={onSave}/>
          ):(
            <EditIcon width="24px" height="24px" onClick={()=>setEditting(true)}/>
          )
        }
      </div>
    </div>
  );
};

