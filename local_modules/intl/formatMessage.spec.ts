import _formatMessage from './formatMessage'


const formatMessage = _formatMessage.bind(null, 'en')

describe('intl', () => {

  describe('formatMessage', () => {

    describe('common', () => {

      it('with no variables', () => {
        const message = { en: 'Hello world' }
        const expected = 'Hello world'

        expect(formatMessage(message)).toEqual(expected)
      })

      it('with html tags', () => {
        const message = { en: '<b>Hello world</b>' }
        const expected = '<b>Hello world</b>'

        expect(formatMessage(message)).toEqual(expected)
      })

      it('with multiple lines', () => {
        const message = {
          en: `
            Discover a new fragrance 
            every month for $14.95
          `,
        }
        const expected = 'Discover a new fragrance every month for $14.95'

        expect(formatMessage(message)).toEqual(expected)
      })

    })

    // Simple variables ----------------------------------------------------- /

    describe('with simple variables', () => {

      it('with no value', () => {
        const message = { en: 'Hello, {username}' }
        const expected = 'Hello, {username}'

        expect(formatMessage(message)).toEqual(expected)
      })

      it('with null value', () => {
        const message = { en: 'Hello, {username}' }
        const values = { username: null }
        const expected = 'Hello, {username}'

        expect(formatMessage(message, values)).toEqual(expected)
      })

      it('with string value', () => {
        const message = { en: 'Hello, {username}' }
        const values = { username: 'John Doe' }
        const expected = 'Hello, John Doe'

        expect(formatMessage(message, values)).toEqual(expected)
      })

      // There is bug in Safari 11.* - "{value}".replace(/{value}/g, "$14.95") becomes "4.95"
      it('with price value', () => {
        const message = { en: 'Price: {price}' }
        const values = { price: '$14.95' }
        const expected = 'Price: $14.95'

        expect(formatMessage(message, values)).toEqual(expected)
      })

      it('with multiple values', () => {
        const message = { en: 'Discover a new {product} {period} for ${price}' }
        const values = { product: 'fragrance', period: 'every month', price: 14.95 }
        const expected = 'Discover a new fragrance every month for $14.95'

        expect(formatMessage(message, values)).toEqual(expected)
      })

    })

    // Plural variables ----------------------------------------------- /

    describe('with plural variable', () => {

      it('with values { count: 1 }', () => {
        const message = { en: 'Discover a new {count, plural, one {product} other {products}}' }
        const values = { count: 1 }
        const expected = 'Discover a new product'

        expect(formatMessage(message, values)).toEqual(expected)
      })

      it('with values { count: 23 }', () => {
        const message = { en: 'Discover new {count, plural, one {product} other {products}}' }
        const values = { count: 23 }
        const expected = 'Discover new products'

        expect(formatMessage(message, values)).toEqual(expected)
      })

      it('if # exists', () => {
        const message = { en: 'Discover {count, plural, one {# new product} other {# new products}}' }
        const values = { count: 23 }
        const expected = 'Discover 23 new products'

        expect(formatMessage(message, values)).toEqual(expected)
      })

      it('with no values', () => {
        const message = { en: 'Discover new {count, plural, one {product} other {products}}' }
        const expected = 'Discover new products'

        expect(formatMessage(message)).toEqual(expected)
      })

      it('with no values #2', () => {
        const message = { en: 'Discover {count, plural, one {# new product} other {# new products}}' }
        const expected = 'Discover new products'

        expect(formatMessage(message)).toEqual(expected)
      })

    })

    // Select variables ----------------------------------------------- /

    describe('with select variable', () => {

      it('with values { gender: "female" }', () => {
        const message = { en: 'Discover a new {gender, select, female {perfume} male {cologne} unisex {fragrance}}' }
        const values = { gender: 'female' }
        const expected = 'Discover a new perfume'

        expect(formatMessage(message, values)).toEqual(expected)
      })

      it('with no values', () => {
        const message = { en: 'Discover a new {gender, select, female {perfume} male {cologne} unisex {fragrance}}' }
        const expected = 'Discover a new perfume'

        expect(formatMessage(message)).toEqual(expected)
      })

      it('with empty values', () => {
        const message = { en: 'Discover a new {gender, select, female {perfume} male {cologne} unisex {fragrance}}' }
        const expected = 'Discover a new perfume'

        expect(formatMessage(message)).toEqual(expected)
      })

    })

    // Mixed variables ---------------------------------- /

    describe('with mixed variables', () => {

      it('with same plural and simple variable names', () => {
        const message = { en: 'Get a free {product}. One {count, plural, one {product} other {products}}' }
        const values = { count: 1, product: 'cologne' }
        const expected = 'Get a free cologne. One product'

        expect(formatMessage(message, values)).toEqual(expected)
      })

      it('inline', () => {
        const message = { en: 'Discover a new {gender, select, female {perfume} male {cologne} unisex {fragrance}} {period} for {price, plural, one {# dollar} other {# dollars}}' }
        const values = { gender: 'male', period: 'every month', price: 1 }
        const expected = 'Discover a new cologne every month for 1 dollar'

        expect(formatMessage(message, values)).toEqual(expected)
      })

      // let's check it! Why not?! If there any chance that smbd can be so %$#! to use multiline variables ??!!
      it('multiline', () => {
        const message = {
          en: `
            Discover a new 
            {
              gender, 
              select, 
              female {perfume} 
              male {cologne} 
              unisex {fragrance}
            } 
            {period} for 
            {price, plural, 
            one {# dollar} other {# dollars}}
          `,
        }
        const values = { gender: 'male', period: 'every month', price: 20 }
        const expected = 'Discover a new cologne every month for 20 dollars'

        expect(formatMessage(message, values)).toEqual(expected)
      })

    })

  })

})
