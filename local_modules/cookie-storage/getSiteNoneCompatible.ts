const intToString = (intValue) => String(intValue)
const stringToInt = (strValue) => parseInt(strValue, 10) || 0

const regexContains = (stringValue, regex) => {
  const matches = stringValue.match(regex)

  return matches !== null
}

const isSafari = (useragent) => {
  const safari_regex = /Version\/.* Safari\//

  return (
    useragent.match(safari_regex) !== null && !isChromiumBased(useragent)
  )
}

const extractRegexMatch = (stringValue, regex, offsetIndex) => {
  const matches = stringValue.match(regex)

  if (matches !== null && matches[offsetIndex] !== undefined) {
    return matches[offsetIndex]
  }

  return null
}

const isIosVersion = (major, useragent) => {
  const regex = /\(iP.+; CPU .*OS (\d+)[_\d]*.*\) AppleWebKit\//

  return extractRegexMatch(useragent, regex, 1) === intToString(major)
}

const isMacosxVersion = (major, minor, useragent) => {
  const regex = /\(Macintosh;.*Mac OS X (\d+)_(\d+)[_\d]*.*\) AppleWebKit\//

  return (
    extractRegexMatch(useragent, regex, 1) === intToString(major)
    && extractRegexMatch(useragent, regex, 2) === intToString(minor)
  )
}

const isMacEmbeddedBrowser = (useragent) => {
  const regex = /^Mozilla\/[\.\d]+ \(Macintosh;.*Mac OS X [_\d]+\) AppleWebKit\/[\.\d]+ \(KHTML, like Gecko\)$/;

  return regexContains(useragent, regex)
}

const isChromiumBased = (useragent) => {
  const regex = /Chrom(e|ium)/

  return regexContains(useragent, regex)
}

const isChromiumVersionAtLeast = (major, useragent) => {
  const regex = /Chrom[^ \/]+\/(\d+)[\.\d]* /
  const version = stringToInt(extractRegexMatch(useragent, regex, 1))

  return version >= major
}

const isUcBrowser = (useragent) => {
  const regex = /UCBrowser\//

  return regexContains(useragent, regex)
}

const dropsUnrecognizedSameSiteCookies = (useragent) => (
  (
    isChromiumBased(useragent)
    && isChromiumVersionAtLeast(51, useragent)
    && !isChromiumVersionAtLeast(67, useragent)
  ) || (
    isUcBrowser(useragent)
    && !isUcBrowserVersionAtLeast(12, 13, 2, useragent)
  )
)

const hasWebKitSameSiteBug = (useragent) => (
  isIosVersion(12, useragent)
  || (
    isMacosxVersion(10, 14, useragent) && (
      isSafari(useragent) || isMacEmbeddedBrowser(useragent)
    )
  )
)

const isSameSiteNoneIncompatible = (useragent) => (
  hasWebKitSameSiteBug(useragent) || dropsUnrecognizedSameSiteCookies(useragent)
)

const isUcBrowserVersionAtLeast = (major, minor, build, useragent) => {
  const regex = /UCBrowser\/(\d+)\.(\d+)\.(\d+)[\.\d]* /
  // Extract digits from three capturing groups.
  const major_version = stringToInt(extractRegexMatch(useragent, regex, 1))
  const minor_version = stringToInt(extractRegexMatch(useragent, regex, 2))
  const build_version = stringToInt(extractRegexMatch(useragent, regex, 3))
  if (major_version !== major) {
    return major_version > major
  }
  if (minor_version != minor) {
    return minor_version > minor
  }

  return build_version >= build
}

const getSiteNoneCompatible = (useragent) => !isSameSiteNoneIncompatible(String(useragent))


export default getSiteNoneCompatible
