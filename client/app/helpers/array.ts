/**
 * Generates array of numbers from the beggining to end
 * e.g range(1, 3) → [ 1, 2, 3 ]
 */
const range = (begin: number, end: number): number[] => {
  begin = Number(begin)
  end   = Number(end)

  if (Number.isNaN(begin) || Number.isNaN(end)) {
    throw new Error('array.range accepts two aguments, both should be numbers')
  }

  const isDownwards = begin > end
  const length = (isDownwards ? begin - end : end - begin) + 1

  return Array.from(Array(length).keys())
    .map((i) => isDownwards ? begin - i : begin + i)
}


export default {
  range,
}
