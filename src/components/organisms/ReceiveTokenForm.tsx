import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import QRCode from "qrcode.react"


interface PropTypes {
  origin: string,
  groupId: string,
  memberId: string,
  onClose: () => void,
};

export default ({origin, groupId, memberId, onClose}: PropTypes) => {
  const [sendAmount, setSendingAmount] = useState<number>(0);

  return (
    <>
      <h4>Selan受け取り設定</h4>
      <Form>
        <Form.Group controlId="formAmount">
          <Form.Label>受取量</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={sendAmount.toString()}
            onChange={(e: any)=>setSendingAmount(parseInt(e.target.value))}
          />
        </Form.Group>

        <h4>Selan送付QR</h4>
        <div>
          <p>{memberId}</p>
          <p>{sendAmount}</p>
          <QRCode value={`${origin}/groups/${groupId}?mode=send&to_member_id=${memberId}&amount=${sendAmount}`} />
        </div>
        <Button variant="primary" onClick={onClose}>
          閉じる
        </Button>
      </Form>
    </>
  )
};
