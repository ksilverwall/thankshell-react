import React, { useEffect, useState } from 'react'
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
  const [url, setUrl] = useState<string>('');

  useEffect(()=>{
    setUrl(`${origin}/groups/${groupId}?mode=send&to_member_id=${memberId}&amount=${sendAmount}`);
  }, [sendAmount])

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
          <QRCode value={url}/>
          <Form.Group controlId="formAmount">
            <Form.Control
              type="text"
              value={url}
            />
          </Form.Group>
        </div>
        <Button variant="primary" onClick={onClose}>
          閉じる
        </Button>
      </Form>
    </>
  )
};
