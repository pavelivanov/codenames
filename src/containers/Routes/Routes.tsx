import React from 'react'
import { Switch, Route } from 'router'

import HomePage from 'pages/HomePage/HomePage'
import Page404 from 'pages/Page404/Page404'


const Routes = () => {
  // ft, ab, cookies

  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="*" component={Page404} />
    </Switch>
  )
}


export default Routes
