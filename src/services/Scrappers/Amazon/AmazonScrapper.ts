import Scrapper from '../Scrapper'
import ItemScrapper from '../ItemScrapper'
import ListScrapper from '../ListScrapper'

export default class AmazonScrapper extends Scrapper {
  protected reseller: Reseller = {
    name: 'Amazon France',
    url: 'https://www.amazon.fr',
    currency: 'EUR'
  }

  protected productUrl = /https:\/\/www\.amazon\.fr\/(.+\/)?[a-z]+\/(product\/)?[A-Z0-9]+/

  protected matches = [
    {
      regex: /https:\/\/www\.amazon\.fr\/gp\/cart\/view\.html/,
      method: doc => this.getCartFromCartPage(doc)
    },
    {
      regex: /https:\/\/www\.amazon\.fr\/hz\/wishlist\//,
      method: doc => this.getCartFromSharedList(doc)
    }
  ]

  protected itemScrapper = new ItemScrapper({
    name: '#productTitle',
    imageUrl: '#landingImage',
    availability: '#availability > span',
    availabilityRegex: /en stock/i,
    price: '#price_inside_buybox'
  })

  protected cartScrapper = new ListScrapper({
    rootSelector: 'div[data-name="Active Items"] .sc-list-item-content',
    scrapper: new ItemScrapper({
      name: '.sc-product-title',
      imageUrl: '.sc-product-image',
      availability: '.sc-product-availability',
      availabilityRegex: /en stock/i,
      url: '.sc-product-link',
      quantity: '.a-dropdown-prompt',
      price: '.sc-price'
    })
  })

  protected sharedListScrapper = new ListScrapper({
    rootSelector: '#g-items > li',
    scrapper: new ItemScrapper({
      name: 'h3 > a',
      imageUrl: '.g-itemImage img',
      availability: '.a-button-text',
      availabilityRegex: /ajouter au panier/i,
      url: '.g-item-details .a-link-normal',
      price: '.a-price > .a-offscreen'
    })
  })

  protected addResellerTag(url: any): string {
    const regex = /(https:\/\/www\.amazon\.fr)?\/.+\/?[a-z]+\/(product\/)?([A-Z0-9]+)(\/.+)?/
    const matches = regex.exec(url)

    if (matches) {
      return `${this.reseller.url}/dp/${matches[3]}/ref=nosim?tag=confgame-21`
    }

    return url
  }
}
