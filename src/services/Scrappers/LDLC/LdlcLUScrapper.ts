import LdlcScrapper from './LdlcScrapper'

export default class LdlcLUScrapper extends LdlcScrapper {
  protected reseller = {
    name: 'LDLC Luxembourg',
    url: 'https://www.ldlc.com/fr-lu',
    currency: 'EUR',
    tag: '#aff764'
  }

  protected productUrl = /https:\/\/www\.ldlc\.com\/fr-lu\/fiche\/[A-Z0-9]+\.html/

  protected matches = [
    {
      regex: /https:\/\/secure2\.ldlc\.com\/fr-lu\/Cart/,
      method: doc => this.getCartFromCartPage(doc)
    },
    {
      regex: /https:\/\/www\.ldlc\.com\/fr-lu\/configurateur-pc/,
      method: doc => this.getCartFromConfigurator(doc)
    }
  ]
}
