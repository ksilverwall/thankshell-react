import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from './ModalOpenButton.module.css';

interface PropsType {
  buttonElement: JSX.Element,
  modalElement: JSX.Element
  className: string | undefined,
};

export default (props: PropsType) => {
  const [isOpening, setOpening] = useState<boolean>(false);

  return(
    <>
      <Modal className={styles.modal} isOpen={isOpening} onRequestClose={()=>setOpening(false)}>
        {props.modalElement}
      </Modal>
      <div className={props.className} onClick={()=>setOpening(true)}>
        {props.buttonElement}
      </div>
    </>
  );
};
