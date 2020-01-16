import React from 'react';
import ReactMarkdown from 'react-markdown'

class MarkDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    }
  }

  componentDidMount() {
    this.loadText(this.props.path)
  }

  render() {
    return (
      <article style={{background: 'white', margin:'20px', padding:'10px'}}>
        <ReactMarkdown source={this.state.text} />
      </article>
    )
  }

  async loadText(path) {
    let response = await fetch(path)
    this.setState({
      text: await response.text(),
    })
  }
}

export function Tos() {
  return (<MarkDown path='/text/tos.md'/>)
}

export function PrivacyPolicy() {
  return (<MarkDown path='/text/privacy-policy.md'/>)
}
