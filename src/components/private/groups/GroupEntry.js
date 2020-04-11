import React from 'react';
import queryString from 'query-string'
import { Alert, Button } from 'react-bootstrap'

class EntryButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      processing: false,
    }
  }

  render() {
    return (<Button onClick={this.entry.bind(this)} disabled={this.state.processing}>参加</Button>)
  }

  async entry() {
    const {api, groupId, params, onComplete, onFailed} = this.props
    try {
      this.setState({processing: true})
      await api.entryToGroup(groupId, params)
      this.setState({processing: false})
      onComplete()
    } catch(err) {
      this.setState({processing: false})
      onFailed(`招待リンクが無効です: ${err.message}`)
    }
  }
}

class GroupEntry extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorMessage: null,
    }
  }

  render() {
    const {location, groupId, onEntry, api} = this.props

    return (
      <article>
        {
          (this.state.errorMessage) ? (
            <Alert variant="danger">{this.state.errorMessage}</Alert>
          ) : null
        }
        <p>グループ『{groupId}』に招待されています</p>
        <EntryButton
          api={api}
          groupId={groupId}
          params={queryString.parse(location.search)}
          onComplete={onEntry}
          onFailed={message => this.setState({errorMessage: message})}
        />
      </article>
    )
  }
}

export default GroupEntry
