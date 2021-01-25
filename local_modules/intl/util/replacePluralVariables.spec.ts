import replacePluralVariables from './replacePluralVariables'


describe('replacePluralVariables', () => {

  it('should return passed message without changes if wrong variable template used #1', () => {
    const message = 'Get {count, plural, one {# product}} for free.'

    expect(replacePluralVariables(message, null, 'en')).toEqual(message)
  })

  it('should return passed message without changes if wrong variable template used #2', () => {
    const message = 'Get {count, plural , one {# product} other {# products} for free.'

    expect(replacePluralVariables(message, null, 'en')).toEqual(message)
  })

  it('should return passed message without changes if wrong variable template used #3', () => {
    const message = 'Get {count, plurall, one {# product} other {# products}} for free.'

    expect(replacePluralVariables(message, null, 'en')).toEqual(message)
  })

  it('should return "other" variable value if values not passed', () => {
    const message = 'Get {count, plural, one {# product} other {# products}} for free.'
    const locale = 'en'
    const expected = 'Get products for free.'

    expect(replacePluralVariables(message, null, locale)).toEqual(expected)
    expect(replacePluralVariables(message, undefined, locale)).toEqual(expected)
    expect(replacePluralVariables(message, {}, locale)).toEqual(expected)
    expect(replacePluralVariables(message, { count: null }, locale)).toEqual(expected)
    expect(replacePluralVariables(message, { count: undefined }, locale)).toEqual(expected)
  })

  it('should work with "es" locale', () => {
    const message = 'Get {count, plural, one {# product} other {# products}} for free.'
    const locale = 'es'
    const expected = 'Get products for free.'

    expect(replacePluralVariables(message, null, locale)).toEqual(expected)
  })

  it('should return "zero" variable', () => {
    const message = 'Get {count, plural, zero {no products} one {# product} other {# products}} for free.'
    const values = { count: 0 }
    const locale = 'en'
    const expected = 'Get no products for free.'

    expect(replacePluralVariables(message, values, locale)).toEqual(expected)
  })

  it('should return "one" variable', () => {
    const message = 'Get {count, plural, one {# product} other {# products}} for free.'
    const values = { count: 1 }
    const locale = 'en'
    const expected = 'Get 1 product for free.'

    expect(replacePluralVariables(message, values, locale)).toEqual(expected)
  })

  it('should return "other" variable', () => {
    const message = 'Get {count, plural, one {# product} other {# products}} for free.'
    const values = { count: 2 }
    const locale = 'en'
    const expected = 'Get 2 products for free.'

    expect(replacePluralVariables(message, values, locale)).toEqual(expected)
  })

  it('should replace multiple variables', () => {
    const message = `
      Get {count, plural, one {# product} other {# products}} for free.
      Get {amount, plural, one {one item} other {items}} for free.
    `
    const values = { count: 2, amount: 1 }
    const locale = 'en'
    const expected = `
      Get 2 products for free.
      Get one item for free.
    `

    expect(replacePluralVariables(message, values, locale)).toEqual(expected)
  })

})
