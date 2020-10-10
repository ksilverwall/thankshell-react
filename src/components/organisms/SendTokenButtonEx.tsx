import React, { useState } from 'react';
import Modal from 'react-modal';
import SendTokenForm from 'components/organisms/SendTokenForm';
import SendTokenButton from 'components/atoms/SendTokenButton';


export default (props: {tokenName: string, members: {}, onSend: any}) => {
  const [isOpening, setModalOpening] = useState<boolean>(false);

  const onSend = async(toMemberId: string, amount: number, comment: string) => {
    await props.onSend(toMemberId, amount, comment);
    setModalOpening(false);
  }

  const modalElement = (
    <SendTokenForm
      members={props.members}
      onSend={onSend}
    />
  );

  const buttonElement = (
    <SendTokenButton tokenName={props.tokenName}/>
  );

  return (
    <>
      <Modal isOpen={isOpening} onRequestClose={()=>setModalOpening(false)}>
        {modalElement}
      </Modal>
      <div onClick={()=>setModalOpening(true)}>
        {buttonElement}
      </div>
    </>
  );
};
