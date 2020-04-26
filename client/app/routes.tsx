import React from 'react'
import { Switch, Route } from 'react-router-dom'

import App from 'containers/App/App'

import HomePage from 'pages/HomePage/HomePage'
import GamePage from 'pages/GamePage/GamePage'


const NotFound = () => (
  <div>404</div>
)

const routes = (
  <App>
    <Switch>
      <Route path="/" exact component={HomePage} />
      <Route path="/game/:gameId" exact component={GamePage} />
      <Route path="*" component={NotFound} />
    </Switch>
  </App>
)


export default routes
