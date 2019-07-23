import LdlcScrapper from './LdlcScrapper'

export default class LdlcCHScrapper extends LdlcScrapper {
  protected reseller = {
    name: 'LDLC Suisse',
    url: 'https://www.ldlc.ch',
    currency: 'CHF',
    tag: '#aff764'
  }

  protected productUrl = /https:\/\/www\.ldlc\.com\/fr-ch\/fiche\/[A-Z0-9]+\.html/

  protected matches = [
    {
      regex: /https:\/\/secure2\.ldlc\.com\/fr-ch\/Cart/,
      method: doc => this.getCartFromCartPage(doc)
    },
    {
      regex: /https:\/\/www\.ldlc\.com\/fr-ch\/configurateur-pc/,
      method: doc => this.getCartFromConfigurator(doc)
    }
  ]
}
