import type { Level } from './types'
// the package is very small
import { Severity } from '@sentry/types'


export const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  http: 4,
  verbose: 5,
  debug: 6,
}

export const isLevelFit = (entryLevel: Level, middlewareLevel: Level) => {
  return levels[entryLevel] <= levels[middlewareLevel]
}

export const getSentryLevel = (level: Level): Severity => {
  if (level === 'fatal') {
    return Severity.Fatal
  }

  if (level === 'error') {
    return Severity.Error
  }

  if (level === 'warn') {
    return Severity.Warning
  }

  if (level === 'info') {
    return Severity.Info
  }

  if (level === 'debug') {
    return Severity.Debug
  }

  return Severity.Log
}
