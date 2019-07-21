import LdlcScrapper from './LdlcScrapper'

export default class LdlcESScrapper extends LdlcScrapper {
  reseller = {
    name: 'LDLC Espagne',
    url: 'https://www.ldlc.com/es-es',
    currency: 'EUR',
    tag: '#aff764'
  }

  productUrl = /https:\/\/www\.ldlc\.com\/es-es\/fiche\/[A-Z0-9]+\.html/

  matches = [
    {
      regex: /https:\/\/secure2\.ldlc\.com\/es-es\/Cart/,
      method: doc => this.fromCart(doc)
    },
    {
      regex: /https:\/\/www\.ldlc\.com\/es-es\/(configurateur-pc|configurador-pc)/,
      method: doc => this.fromConfigurateur(doc)
    }
  ]
}
