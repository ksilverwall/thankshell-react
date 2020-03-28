import React from 'react'
import Modal from 'react-modal'
import { Button, Form } from 'react-bootstrap'

Modal.setAppElement('#root')

class SendTokenForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSending: false,
      message: '',
      sendTo: '',
      sendAmount: props.defaultAmount ? props.defaultAmount : 0,
      sendComment: '',
    };
  }

  render() {
    return (
      <React.Fragment>
        <h4>Selanを送る</h4>
        <Form>
          <p className="warning-text">{this.state.message}</p>
          <Form.Group controlId="formToAddress">
            <Form.Label>送り先</Form.Label>
            <Form.Control
              type="text"
              placeholder="TO"
              value={this.state.sendTo}
              onChange={e=>this.setState({sendTo: e.target.value})}
            />
          </Form.Group>
          <Form.Group controlId="formAmount">
            <Form.Label>送付量</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={this.state.sendAmount}
              onChange={e=>this.setState({sendAmount: e.target.value})}
            />
          </Form.Group>
          <Form.Group controlId="formCommnet">
            <Form.Label>コメント</Form.Label>
            <Form.Control
              type="text"
              placeholder="Comment"
              value={this.state.sendComment}
              onChange={e=>this.setState({sendComment: e.target.value})}
            />
          </Form.Group>
          <Button variant="primary"
            onClick={this.sendToken.bind(this)}
            disabled={this.state.isSending}
          >
            送る
          </Button>
          <p className="warning-text">送付後の取り消しはできませんのでご注意ください</p>
        </Form>
      </React.Fragment>
    )
  }

  async sendToken() {
    this.setState({
      isSenging: true,
      message: '処理中...',
    })

    try {
      const sendInfo = {
        from:    this.props.from,
        to:      this.state.sendTo,
        amount:  this.state.sendAmount,
        comment: this.state.sendComment,
      }

      await this.props.api.createTransaction('selan', sendInfo);
      this.props.onComplete()
    } catch(e) {
      this.setState({
        isSenging: false,
        message: 'ERROR: ' + e.message,
      })
    }
  }
}

class SendTokenButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: false,
    }
  }

  render() {
    return (
      <React.Fragment>
        <Button variant="primary" onClick={this.openModal.bind(this)}>
          送る
        </Button>
        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal.bind(this)}>
          <button type="button" className="close" aria-label="close" onClick={this.closeModal.bind(this)}>
            <span aria-hidden="true">&times;</span>
          </button>
          <SendTokenForm
            mutableFrom={this.props.adminMode}
            from={this.props.adminMode ? 'sla_bank' : this.props.user.user_id}
            api={this.props.api}
            onComplete={this.onCompleted.bind(this)}
          />
        </Modal>
      </React.Fragment>
    )
  }

  openModal() {
    this.setState({modalIsOpen: true})
  }

  closeModal() {
    this.setState({modalIsOpen: false})
  }

  onCompleted() {
    this.closeModal()
    this.props.callback()
  }
}

export default SendTokenButton
