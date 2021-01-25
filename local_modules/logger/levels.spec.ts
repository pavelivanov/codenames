import { isLevelFit } from './levels'


describe('levels', () => {

  test('isLevelFit should block low priority messages', () => {
    expect(isLevelFit('debug', 'error')).toBeFalsy()
    expect(isLevelFit('warn', 'error')).toBeFalsy()
  })

  test('isLevelFit should pass high priority messages', () => {
    expect(isLevelFit('error', 'error')).toBeTruthy()
    expect(isLevelFit('fatal', 'error')).toBeTruthy()
  })
})
