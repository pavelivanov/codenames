const getSearchParams = (search) => {
  let params = {}

  new URLSearchParams(search).forEach((value, key) => {
    try {
      params[key] = JSON.parse(value)
    }
    catch (error) {
      params[key] = value
    }
  })

  return params
}


export default getSearchParams
