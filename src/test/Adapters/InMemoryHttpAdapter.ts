import HttpService from '../../services/Http/HttpService'

export default class InMemoryHttpAdapter implements HttpService {
  document: Document

  constructor(document: Document) {
    this.document = document
  }

  get = async (url: string) => {
    return new Promise((resolve: (doc: Document) => void, reject) => {
      resolve(this.document)
    })
  }
}
