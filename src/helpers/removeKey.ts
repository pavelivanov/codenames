const removeKey = <O extends object, K extends string>(obj: O, key: K): Omit<O, K> => {
  const res = { ...obj }
  // @ts-ignore
  delete res[key]
  return res
}


export default removeKey
