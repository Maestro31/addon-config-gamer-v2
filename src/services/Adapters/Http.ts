import HttpService from "../Http/HttpService";
import axios from 'axios'

export default class Http implements HttpService {
  get = async (url: string): Promise<string | Document> => {
    return axios.get(url).then(({ data }) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      return doc
    }).catch(error => {
      console.error(error.message)
      return null
    })
  }
}