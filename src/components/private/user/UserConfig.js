import React from 'react'
import { ReactSVG } from 'react-svg'
import LogoutButton from './LogoutButton.js'
import { css } from 'glamor'

const EditButton = (props) => {
  const styles = css({
    ' svg': {
      height: "30px",
      width: "30px",
      padding: "5px",
    },
  })

  return (
    <ReactSVG src='/images/pen.svg' {...styles} onClick={props.onClick}/>
  )
}

const SubmitButton = (props) => {
  const styles = css({
    ' svg': {
      height: "30px",
      width: "30px",
      padding: "5px",
    },
  })

  return (
    <ReactSVG src='/images/check.svg' {...styles} onClick={props.onClick}/>
  )
}

class UserConfig extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editMode: false,
      editBuffer: "",
    }
  }
  render() {
    const props = this.props
    const flex = css({
      display: '-webkit-flex',
      display: 'flex',
    })

    return (
      <section>
        <div class='flex-area' {...flex}>
          {
            this.state.editMode ? (
              <React.Fragment>
                <input type="text" value={this.state.editBuffer} onChange={this.onChange.bind(this)}/>
                <SubmitButton onClick={this.onSubmit.bind(this)}/>
              </React.Fragment>
            )
            : (
              <React.Fragment>
                <h2>{props.user ? props.user.displayName : '-----'}</h2>
                <EditButton onClick={this.onEdit.bind(this)}/>
              </React.Fragment>
            )
          }
        </div>
        <p>ID: {props.user ? props.user.user_id : '-----'}</p>
        <LogoutButton auth={props.auth} />
      </section>
    )
  }

  onEdit() {
    this.setState({
      editMode: true,
      editBuffer: this.props.user.displayName,
    })
  }

  onChange(event) {
    this.setState({editBuffer: event.target.value});
  }

  onSubmit() {
    if (this.state.editBuffer !== this.props.user.displayName) {
      // TODO: implement updateUser callback
      this.props.updateUser({displayName: this.state.editBuffer})
    }
    this.setState({editMode: false})
  }
}

export default UserConfig
