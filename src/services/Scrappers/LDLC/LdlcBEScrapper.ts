import LdlcScrapper from './LdlcScrapper'

export default class LdlcBEScrapper extends LdlcScrapper {
  protected reseller = {
    name: 'LDLC Belgique',
    url: 'https://www.ldlc.com/fr-be',
    currency: 'EUR',
    tag: '#aff764'
  }

  protected productUrl = /https:\/\/www\.ldlc\.com\/fr-be\/fiche\/[A-Z0-9]+\.html/

  protected matches = [
    {
      regex: /https:\/\/secure2\.ldlc\.com\/fr-be\/Cart/,
      method: doc => this.getCartFromCartPage(doc)
    },
    {
      regex: /https:\/\/www\.ldlc\.com\/fr-be\/configurateur-pc/,
      method: doc => this.getCartFromConfigurator(doc)
    }
  ]
}
