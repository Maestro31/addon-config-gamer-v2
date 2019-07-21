import fs = require('fs')

export function readDocumentFromFile(filename: string) {
  const content = fs.readFileSync(filename, 'utf8')
  return new DOMParser().parseFromString(content, 'text/html')
}
