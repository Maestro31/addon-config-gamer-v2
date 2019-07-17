export default interface HttpService {
  get: (url: string) => Promise<string | Document>
}