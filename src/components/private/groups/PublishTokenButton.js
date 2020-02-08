import React from 'react';
import Modal from 'react-modal'
import { Button } from 'react-bootstrap';

Modal.setAppElement('#root')

class PublishTokenForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSending: false,
      message: null,
      amount: 10000,
    };
  }

  render() {
    return (
      <React.Fragment>
	    <h4>Selanを増刷する</h4>
        <form>
          <p className="warning-text">{this.state.message}</p>
          <div className="form-group">
            <input
              className="form-control text-right"
              type="number" name="amount" min="1000"
              value={this.state.amount}
              onChange={e=>this.setState({amount: e.target.value})}/>
            <Button
              variant="primary"
              onClick={this.publish.bind(this)}
              disabled={this.state.isSending}>新規発行</Button>
          </div>
        </form>
        <br/>
        <p className="text-center text-danger">削除未実装のためご注意ください</p>
      </React.Fragment>
    )
  }

  async publish() {
    this.setState({
      isSenging: true,
      message: '発行中...',
    })

    try {
      await this.props.api.publish('selan', 'sla_bank', this.state.amount);
      this.props.onComplete()
    } catch(e) {
      this.setState({
        isSenging: false,
        message: 'ERROR: ' + e.message,
      })
    }
  }
}

export default class PublishTokenButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
    };
  }

  render() {
    return (
      <React.Fragment>
        <Button variant="primary" onClick={this.openModal.bind(this)}>
          新規発行
        </Button>

        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal.bind(this)}>
          <button type="button" className="close" aria-label="close" onClick={this.closeModal.bind(this)}>
            <span aria-hidden="true">&times;</span>
          </button>
          <PublishTokenForm
            api={this.props.api}
            onComplete={this.onComplete.bind(this)}
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

  onComplete() {
    this.closeSendTokenModal()
    this.props.onComplete()
  }
}

