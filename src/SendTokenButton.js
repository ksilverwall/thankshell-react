import React from 'react'
import Modal from 'react-modal'
import { Button } from 'react-bootstrap'

Modal.setAppElement('#root')

class SendTokenForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSending: false,
      message: null,
      sendFrom: props.from,
      sendTo: null,
      sendAmount: 1000,
      sendComment: null,
    };
  }

  render() {
    return (
      <React.Fragment>
        <h4>Selanを送る</h4>
        <form className="send-token-modal-form">
          <p className="warning-text">{this.state.message}</p>
          <div className="send-map">
            <div className="from-block" colspan="2">{this.state.sendFrom}</div>
            <div className="arrow">
              <input
                className="amount form-condivol"
                type="number"
                min="1"
                name="amount"
                value={this.state.sendAmount}
                onChange={e=>this.setState({sendAmount: e.target.value})}
              />
            </div>
            <div className="to-block">
              <input
                className="form-condivol"
                type="text"
                name="to"
                placeholder="TO"
                value={this.state.sendTo}
                onChange={e=>this.setState({sendTo: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label>コメント</label>
            <input
              className="form-control"
              type="text"
              name="comment"
              value={this.state.sendComment}
              onChange={e=>this.setState({sendComment: e.target.value})}
            />
          </div>

          <div style={{"text-align": "center"}}>
            <Button
              variant="primary"
              onClick={this.sendToken.bind(this)}
              disabled={this.state.isSending}
            >
              送る
            </Button>
          </div>
          <p className="warning-text">送金後の取り消しはできませんのでご注意ください</p>
        </form>
      </React.Fragment>
    )
  }

  async sendToken() {
    this.setState({
      isSenging: true,
      message: '送金中...',
    })

    try {
      const sendInfo = {
        from:    this.state.sendFrom,
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
            from={this.props.user.user_id}
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
