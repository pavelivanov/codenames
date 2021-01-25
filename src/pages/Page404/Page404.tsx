import React from 'react'

import StatusCode from 'containers/StatusCode/StatusCode'

import s from './Page404.scss'


const Page404 = () => (
  <>
    <StatusCode value={404} />
    <div className={s.title}>404!</div>
  </>
)


export default Page404
