import replaceSimpleVariables from './util/replaceSimpleVariables'
import replacePluralVariables from './util/replacePluralVariables'
import replaceSelectVariables from './util/replaceSelectVariables'
import stripSpaces from './util/stripSpaces'


const formatMessage = (locale: string = 'en', message: Intl.MessageTranslation, values?: Intl.MessageValues) => {
  if (typeof message === 'string') {
    return message
  }

  // TODO add error handler - added on 10/9/20 by pavelivanov
  if (!message) {
    return '{{ missed_translation }}'
  }

  let fMessage = stripSpaces(message[locale])

  fMessage = replaceSelectVariables(fMessage, values)
  fMessage = replacePluralVariables(fMessage, values, locale)
  fMessage = replaceSimpleVariables(fMessage, values)

  return fMessage || '{{ missed_translation }}'
}


export default formatMessage
