import { useRef, useEffect, useState, useCallback } from 'react'
import { useDeepMemo } from 'hooks'
import axios from 'axios'


export type useQueryOptionsType = {
  name?: string
  variables?: object
  tokenName?: string
  mockError?: string
  mockResponse?: any
  mockDelay?: number
  withErrorModal?: boolean
  withNestedErrors?: boolean
  modifyResult?: (any) => any
  skip?: boolean // to skip fetching
}

type InitialStateType<T extends {}> = {
  isFetching: boolean
  data: T | null
  errors: object | null
}

type ReturnType<T extends {}> = InitialStateType<T> & {
  fetch(): Promise<void>
}


const request = axios.create({
  baseURL: 'https://graphql.zhokhov.com/graphql',
  withCredentials: true,
})

request.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.data.message) {
    return Promise.reject(error.response.data.message)
  }

  return Promise.reject(error)
})

const useQuery = <T extends {}>(name: string, query: string, options: useQueryOptionsType = {}): ReturnType<T> => {
  const initialState: InitialStateType<T> = { isFetching: !options.skip, data: null, errors: null }
  const [ state, setState ] = useState(initialState)
  const isFetched = useRef(options.skip)

  const updatedOptions = useDeepMemo(() => ({
    ...options,
    query,
  }), [ options, query ])

  const handleFetch = useCallback(() => {
    const { query, modifyResult, ...requestOptions } = updatedOptions

    // Skipped first setState to avoid extra render
    if (isFetched.current) {
      setState({ data: null, errors: null, isFetching: true })
    }
    else {
      isFetched.current = true
    }

    return request.post(`graphql?name=${name}`, {
      query,
      ...requestOptions,
    })
      .then(
        ({ data: { data, errors } }) => {
          if (errors) {
            setState({ errors, isFetching: false, data: null })
            return
          }

          let finalData

          if (typeof modifyResult === 'function') {
            finalData = modifyResult(data)
          }
          else {
            finalData = data
          }

          setState({ data: finalData, isFetching: false, errors: null })
        },
        () => setState({ errors: null, isFetching: false, data: null })
      )
  }, [ updatedOptions ])

  useEffect(() => {
    if (!updatedOptions.skip) {
      handleFetch()
    }
  }, [ handleFetch, updatedOptions.skip ])

  return { ...state, fetch: handleFetch }
}


export default useQuery
