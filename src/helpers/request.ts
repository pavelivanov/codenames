import axios from 'axios'


const request = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '//codenames.wtf/rest' : '//localhost:3007/rest',
  // withCredentials: true,
  timeout: 15 * 1000,
})

request.interceptors.response.use((response) => response, (error) => {
  const message = error.response && error.response.data.message || error

  console.log('request error:', message)
  return Promise.reject(message)
})


export default request
