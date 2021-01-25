import getVariableValues from './getVariableValues'


describe('getVariableValues', () => {

  it('should transform variable string to values map', () => {
    const message = '{sex, select, female {perfume} male {cologne} unisex {fragrance}}'
    const expected = { female: 'perfume', male: 'cologne', unisex: 'fragrance' }

    expect(getVariableValues(message)).toStrictEqual(expected)
  })

})
