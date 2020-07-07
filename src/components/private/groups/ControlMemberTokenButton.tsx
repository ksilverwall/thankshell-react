import React, {useState} from 'react'
import Modal from 'react-modal'
import { Button } from 'react-bootstrap'

Modal.setAppElement('#root')

class ControlMemberTokenForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSending: false,
      message: null,
      sendFrom: props.from,
      sendTo: '',
      sendAmount: this.props.defaultAmount,
      sendComment: '',
    };
  }

  render() {
    return (
      <React.Fragment>
        <h4>Selanを送る</h4>
        <form className="send-token-modal-form">
          <p className="warning-text">{this.state.message}</p>


          <div className="send-map">
            <div className="from-block" colSpan="2">
              {
                this.props.mutableFrom
                ? (
                  <input
                    className="form-condivol"
                    type="text"
                    name="to"
                    placeholder="FROM"
                    value={this.state.sendFrom}
                    onChange={e=>this.setState({sendFrom: e.target.value})}
                  />
                )
                : this.state.sendFrom
              }
            </div>

            <div className="arrow">
              ↓
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

          <div style={{"textAlign": "center"}}>
            <Button variant="primary"
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

const ControlMemberTokenButton = ({callback, api}) => {
  const [isModalOpening, setModalOpening] = useState(false)

  return (
    <React.Fragment>
      <Button variant="primary" onClick={()=>setModalOpening(true)}>
        送る
      </Button>
      <Modal isOpen={isModalOpening} onRequestClose={()=>setModalOpening(false)}>
        <button type="button" className="close" aria-label="close" onClick={()=>setModalOpening(false)}>
          <span aria-hidden="true">&times;</span>
        </button>
        <ControlMemberTokenForm
          mutableFrom={true}
          from={'sla_bank'}
          api={api}
          defaultAmount={10000}
          onComplete={()=>{
            setModalOpening(false)
            callback()
          }}
        />
      </Modal>
    </React.Fragment>
  )
}

export default ControlMemberTokenButton
