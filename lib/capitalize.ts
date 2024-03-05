export const Capitalize = (str: string) => {
  str = str?.replace(/([A-Z])/g, ' $1')
  return str?.charAt(0)?.toUpperCase() + str?.slice(1)?.toLowerCase()
}

export const WordCapitalize = (str: string) => {
  // str = str?.replace(/([A-Z])/g, ' $1')
  return (
    str?.trim()?.charAt(0)?.toUpperCase() + str?.trim()?.slice(1)?.toLowerCase()
  )
}
