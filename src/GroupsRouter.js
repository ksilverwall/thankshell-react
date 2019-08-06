import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import { NotFoundPage } from './Error.js'

const GroupsRouter = () => (
  <Switch>
    <Route exact path='/groups/:id' component={GroupIndex} />
    <Route exact path='/groups/:id/admin' component={GroupAdmin} />
    <Route component={NotFoundPage} />
  </Switch>
)

class GroupIndex extends React.Component {
  render() {
    const {params} = this.props.match
    return (
      <h1>This is dummy {params.id} group index</h1>
    )
  }
}

class GroupAdmin extends React.Component {
  render() {
    const {params} = this.props.match
    return (
      <h1>This is dummy {params.id} admin page</h1>
    )
  }
}

export default GroupsRouter
