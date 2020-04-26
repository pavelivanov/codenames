import React from 'react'
import { BrowserRouter } from 'react-router-dom'


const Root = ({ routes }) => (
  <BrowserRouter>
    {routes}
  </BrowserRouter>
)


export default Root
