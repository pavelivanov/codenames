import words from './words'


const hashesMap = {
  red: [ 1, 5, 8, 13, 27, 33, 41, 56, 72 ],
  blue: [ 3, 7, 11, 29, 31, 37, 55, 67, 81 ],
  neutral: [ 2, 4, 9, 14, 28, 44, 59, 77, 80 ],
  black: [ 6, 10, 15, 22, 34, 36, 46 ],
}

const hashColors = (colors: Color[]): number[] => (
  colors.map((color) => {
    const maxIndex = hashesMap[color].length - 1
    const index = Math.floor(Math.random() * maxIndex)

    return hashesMap[color][index]
  })
)

const shuffle = (arr): any[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  return arr
}

const getRandomizedArr = (arr: string[], count: number): string[] => {
  let len = arr.length
  const result = []
  const taken = []

  while (count--) {
    const index = Math.floor(Math.random() * len)

    result[count] = arr[index in taken ? taken[index] : index]
    taken[index] = --len in taken ? taken[len] : len
  }

  return result
}

type Opts = {
  cols: number
  rows: number
  lang: string
}

const createBoard = (opts: Opts) => {
  const { cols, rows, lang = 'en' } = opts

  const counts = {
    '36': [ 13, 12, 9, 2 ],
    '30': [ 11, 10, 8, 1 ],
    '25': [ 9, 8, 7, 1 ],
    '20': [ 7, 6, 6, 1 ],
  }

  const cellCount: number = Number(cols) * Number(rows)

  const [ count1, count2, neutralCount, blackCount ] = counts[String(cellCount)]

  const redCount: number = Math.round(Math.random()) ? count1 : count2
  const blueCount: number = count1 + count2 - redCount

  const colors: number[] = hashColors(shuffle([
    ...new Array(redCount).fill('red'),
    ...new Array(blueCount).fill('blue'),
    ...new Array(neutralCount).fill('neutral'),
    ...new Array(blackCount).fill('black'),
  ]))

  const cards = getRandomizedArr(words[lang.toLowerCase()], cellCount)

  return {
    cards,
    colors,
  }
}


export default createBoard
