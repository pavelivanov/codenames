import React from 'react'
import { Helmet } from 'react-helmet-async'


type StatusCodeProps = {
  value: number
}

const StatusCode: React.FunctionComponent<StatusCodeProps> = ({ value }) => (
  <Helmet bodyAttributes={{ statusCode: value }} />
)


export default StatusCode
