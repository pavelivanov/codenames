import replaceSelectVariables from './replaceSelectVariables'


describe('replaceSelectVariables', () => {

  it('should return passed message without changes if wrong variable template used #1', () => {
    const message = 'Discover a new {gender, select, female {perfume}}'

    expect(replaceSelectVariables(message, null)).toEqual(message)
  })

  it('should return passed message without changes if wrong variable template used #2', () => {
    const message = 'Discover a new {gender, select , female {perfume} male {cologne} unisex {fragrance}}'

    expect(replaceSelectVariables(message, null)).toEqual(message)
  })

  it('should return passed message without changes if wrong variable template used #3', () => {
    const message = 'Discover a new {gender, selectt, female {perfume} male {cologne} unisex {fragrance}}'

    expect(replaceSelectVariables(message, null)).toEqual(message)
  })

  it('should return "other" variable value if values not passed', () => {
    const message = 'Discover a new {gender, select, female {perfume} male {cologne} other {fragrance}}'
    const expected = 'Discover a new fragrance'

    expect(replaceSelectVariables(message, null)).toEqual(expected)
    expect(replaceSelectVariables(message, undefined)).toEqual(expected)
    expect(replaceSelectVariables(message, {})).toEqual(expected)
    expect(replaceSelectVariables(message, { count: null })).toEqual(expected)
    expect(replaceSelectVariables(message, { count: undefined })).toEqual(expected)
  })

  it('should return "female" (first) variable value if values not passed and "other" variable does not exist', () => {
    const message = 'Discover a new {gender, select, female {perfume} male {cologne} unisex {fragrance}}'
    const expected = 'Discover a new perfume'

    expect(replaceSelectVariables(message, null)).toEqual(expected)
  })

  it('should replace variable with passed value', () => {
    const message = 'Discover a new {gender, select, female {perfume} male {cologne} unisex {fragrance}}'
    const values = { gender: 'male' }
    const expected = 'Discover a new cologne'

    expect(replaceSelectVariables(message, values)).toEqual(expected)
  })

  it('should return "other" variable', () => {
    const message = 'Discover a new {gender, select, female {perfume} male {cologne} unisex {fragrance}}'
    const values = { gender: 'zero' }
    const expected = 'Discover a new perfume'

    expect(replaceSelectVariables(message, values)).toEqual(expected)
  })

  it('should replace multiple variables', () => {
    const message = `
      Discover a new {gender, select, female {perfume} male {cologne} unisex {fragrance}}.
      Get {count, select, 1 {one item} other {items}} for free.
    `
    const values = { gender: 'unisex', count: 1 }
    const expected = `
      Discover a new fragrance.
      Get one item for free.
    `

    expect(replaceSelectVariables(message, values)).toEqual(expected)
  })

})
