export default interface HttpService {
  get: (url: string) => Promise<Document>
}
