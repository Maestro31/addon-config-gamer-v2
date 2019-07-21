import Scrapper from '../Scrapper'
import ListScrapper from '../ListScrapper'
import ItemScrapper from '../ItemScrapper'
import ConfiguratorItemScrapper from '../ConfiguratorItemScrapper'

export default class LdlcScrapper extends Scrapper {
  reseller = {
    name: 'LDLC France',
    url: 'https://www.ldlc.com',
    currency: 'EUR',
    tag: '#aff764'
  }

  productUrl = /https:\/\/www\.ldlc\.com\/fiche\/[A-Z0-9]+\.html/

  matches = [
    {
      regex: /https:\/\/secure2\.ldlc\.com\/fr-fr\/Cart/,
      method: doc => this.fromCart(doc)
    },
    {
      regex: /https:\/\/www\.ldlc\.com\/configurateur-pc/,
      method: doc => this.fromConfigurateur(doc)
    }
  ]

  itemScrapper = new ItemScrapper({
    name: '.title-1',
    imageUrl: '.photodefault > img',
    availability: '.stock',
    availabilityRegex: /en stock/i,
    price: '.price > .price'
  })

  cartScrapper = new ListScrapper({
    rootSelector: '.cart-product-list .item',
    scrapper: new ItemScrapper({
      name: '.title > a',
      imageUrl: '.pic > img',
      availability: '.stock',
      availabilityRegex: /en stock/i,
      url: '.title > a',
      quantity: '.quantity .multiSel',
      price: '.cell-subtotal .price'
    })
  })

  configuratorScrapper = new ListScrapper({
    rootSelector: '.sbloc li',
    scrapper: new ConfiguratorItemScrapper({
      name: '.name',
      availability: '.stock',
      availabilityAttribute: 'title',
      availabilityRegex: /en stock/i,
      quantity: '.name',
      price: '.price',
      imageUrl: '.pic img',
      url: '.product > a',
      rootListSelector: '.elements .wrap-item',
      searchByNameSelector: '.product .name'
    })
  })
}
