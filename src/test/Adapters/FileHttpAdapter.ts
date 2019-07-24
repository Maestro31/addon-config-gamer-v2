import HttpService from '../../services/Http/HttpService'
const fs = require('fs')

export default class FileHttpAdapter implements HttpService {
  get = async (url: string) => {
    return new Promise((resolve: (doc: Document) => void, reject) => {
      const content = fs.readFileSync(url, 'utf8')
      const parser = new DOMParser()
      const doc = parser.parseFromString(content, 'text/html')
      resolve(doc)
    })
  }
}
