import Logger from './logger'


describe('logger', () => {

  test('log should call middlewares and pass new entry each time', () => {
    const logger = new Logger()

    const middleware = jest.fn((entry, next) => {
      next({
        ...entry,
        fromMiddleware: 'Test',
      })
    })

    const middleware2 = jest.fn((entry, next) => {
      next(entry)
    })

    logger.use(middleware, middleware2)
    logger.log('fatal', 'Test', {
      capture: false,
    })

    expect(middleware).toBeCalledWith(
      expect.objectContaining({
        level: 'fatal',
        message: 'Test',
      }),
      expect.any(Function)
    )

    expect(middleware2).toBeCalledWith(
      expect.objectContaining({
        level: 'fatal',
        message: 'Test',
        fromMiddleware: 'Test',
      }),
      expect.any(Function)
    )
  })

  test('log should pass extra field by options', () => {
    const logger = new Logger()

    const middleware = jest.fn((entry, next) => {
      next(entry)
    })

    logger.use(middleware)
    logger.log('error', 'Test', {
      contexts: {
        test: 'test',
      }
    })

    expect(middleware).toBeCalledWith(
      expect.objectContaining({
        level: 'error',
        message: 'Test',
        contexts: {
          test: 'test',
        },
      }),
      expect.any(Function)
    )
  })

  test('helpers should provide correct levels', () => {
    const logger = new Logger()

    const middleware = jest.fn((entry, next) => {
      next(entry)
    })

    logger.use(middleware)

    const levels = [ 'fatal', 'error', 'warn', 'info', 'debug' ]

    levels.forEach((level) => {
      logger[level]('Test')

      expect(middleware).toBeCalledWith(
        expect.objectContaining({
          level,
          message: 'Test',
        }),
        expect.any(Function)
      )
    })
  })
})
