import LdlcScrapper from './LdlcScrapper'

export default class LdlcCHScrapper extends LdlcScrapper {
  reseller = {
    name: 'LDLC Suisse',
    url: 'https://www.ldlc.ch',
    currency: 'CHF',
    tag: '#aff764'
  }

  productUrl = /https:\/\/www\.ldlc\.com\/fr-ch\/fiche\/[A-Z0-9]+\.html/

  matches = [
    {
      regex: /https:\/\/secure2\.ldlc\.com\/fr-ch\/Cart/,
      method: doc => this.fromCart(doc)
    },
    {
      regex: /https:\/\/www\.ldlc\.com\/fr-ch\/configurateur-pc/,
      method: doc => this.fromConfigurateur(doc)
    }
  ]
}
