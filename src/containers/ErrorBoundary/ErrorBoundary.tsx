import { Component } from 'react'
import logger from 'logger'


class ErrorBoundary extends Component {

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error(error)
  }

  render() {
    return this.props.children
  }
}


export default ErrorBoundary
