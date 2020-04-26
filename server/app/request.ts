import axios from 'axios'


const request = axios.create({
  baseURL: 'https://graphql.zhokhov.com/graphql',
  //withCredentials: true,
})

request.interceptors.response.use((response) => {
  const { data, errors } = response

  if (errors) {
    throw new Error(JSON.stringify(errors))
  }

  return data && data.data
}, (error) => {
  if (error.response && error.response.data.message) {
    throw new Error(error.response.data.message)
  }

  throw new Error(error)
})


export default request
