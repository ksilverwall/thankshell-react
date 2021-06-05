import React, { useState } from 'react'
import Modal from 'react-modal'
import { Button, Form, ListGroup } from 'react-bootstrap'
import { css } from 'glamor'

Modal.setAppElement('#root')

const SendToCandidate = ({word, members, onSelected}) => {
  const styles = css({
    color: "gray",
  })
  const memberIds = Object.keys(members)
    .filter(memberId => memberId.startsWith(word) || members[memberId].displayName.startsWith(word))
  return (
    <ListGroup>
      {
        memberIds.length
          ? memberIds.slice(0, 5)
            .map((memberId, index) => (
              <ListGroup.Item
                key={index}
                onClick={() => onSelected(memberId)}
              >
                {memberId} <span {...styles}>{members[memberId].displayName}</span>
              </ListGroup.Item>
            ))
          : <ListGroup.Item>候補なし</ListGroup.Item>
      }
    </ListGroup>
  )
}


const FromAddressInput = (props: {
  value: string,
  onChange: (memberId: string) => void,
  members: any,
}) => {
  const [isOpenAutoCorrect, setOpenAutoCorrect] = useState(false);

  return (
    <>
      <Form.Group controlId="formToAddress">
      <Form.Label>送り先</Form.Label>
      <Form.Control
        type="text"
        placeholder="TO"
        value={props.value}
        onChange={(e: any) => props.onChange(e.target.value)}
        onFocus={()=>setOpenAutoCorrect(true)}
      />
      {
        isOpenAutoCorrect ? (
          <SendToCandidate
            word={props.value}
            members={props.members}
            onSelected={(memberId: string) => {
              setOpenAutoCorrect(false);
              props.onChange(memberId)
            }}
          />
        ) : null
      }
      </Form.Group>
    </>
  );
};

const SendTokenForm = (props: {defaultValue: {toMemberId?: string, amount?: number}, members: {}, isSending: boolean, onSend: any}) => {
  const [sendTo, setSendingTo] = useState<string>(props.defaultValue.toMemberId || '');
  const [sendAmount, setSendingAmount] = useState<number>(props.defaultValue.amount || 0);
  const [sendComment, setSendingComment] = useState<string>('');

  return (
    <>
      <FromAddressInput
        value={sendTo}
        onChange={(value: string)=>setSendingTo(value)}
        members={props.members}
      />
      <Form.Group controlId="formAmount">
        <Form.Label>送付量</Form.Label>
        <Form.Control
          type="number"
          min="1"
          value={sendAmount.toString()}
          onChange={(e: any)=>setSendingAmount(parseInt(e.target.value))}
        />
      </Form.Group>
      <Form.Group controlId="formCommnet">
        <Form.Label>コメント</Form.Label>
        <Form.Control
          type="text"
          placeholder="Comment"
          value={sendComment}
          onChange={(e: any)=>setSendingComment(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary"
        onClick={()=>props.onSend(
          sendTo,
          sendAmount,
          sendComment
        )}
        disabled={props.isSending}
      >
        送る
      </Button>
    </>
  )
}

interface PropTypes {
  defaultValue: {toMemberId?: string, amount?: number},
  members: {},
  onSend: (toMemberId: string, amount: number, comment: string) => Promise<void>,
};

export default ({defaultValue, members, onSend}: PropTypes) => {
  const [message, setMessage] = useState<string>('');
  const [isSending, setSending] = useState<boolean>(false);

  return (
    <>
      <h4>Selanを送る</h4>
      <Form>
        <p className="warning-text">{message}</p>
        <SendTokenForm
          defaultValue={defaultValue}
          members={members}
          isSending={isSending}
          onSend={async(toMemberId: string, amount: number, comment: string)=>{
            try {
              setSending(true);
              setMessage('処理中...');

              await onSend(toMemberId, amount, comment);
            } catch(error) {
              setMessage('ERROR: ' + error.message);
            } finally {
              setSending(false);
            }
          }}
        />
        <p className="warning-text">送付後の取り消しはできませんのでご注意ください</p>
      </Form>
    </>
  )
};
