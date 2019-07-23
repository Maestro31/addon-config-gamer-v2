import Scrapper from '../Scrapper'
import ListScrapper from '../ListScrapper'
import ItemScrapper from '../ItemScrapper'
import ConfiguratorItemScrapper from '../ConfiguratorItemScrapper'

export default class MaterielNetScrapper extends Scrapper {
  reseller: Reseller = {
    name: 'Materiel.net',
    url: 'https://www.materiel.net',
    currency: 'EUR',
    tag: '#a_aid=aff764'
  }

  productUrl = /https:\/\/www\.materiel\.net\/produit\/[0-9]+\.html/

  matches = [
    {
      regex: /https:\/\/secure\.materiel\.net\/Cart/,
      method: doc => this.getCartFromCartPage(doc)
    },
    {
      regex: /https:\/\/www\.materiel\.net\/configurateur-pc-sur-mesure/,
      method: doc => this.getCartFromConfigurator(doc)
    },
    {
      regex: /https:\/\/secure\.materiel\.net\/Account\/SavedCartsSection/,
      method: doc => this.getCartFromSharedList(doc)
    },
    {
      regex: /https:\/\/secure\.materiel\.net\/Cart\/SharedCart/,
      method: doc => this.getCartFromCartPage(doc)
    }
  ]

  itemScrapper = new ItemScrapper({
    name: '.c-product__header h1',
    imageUrl: '.o-panel__content .c-product__thumb > img',
    imageUrlAttribute: 'data-src-large',
    availability: '.o-availability__value',
    availabilityRegex: /en stock/i,
    price: '.o-product__price--large'
  })

  cartScrapper = new ListScrapper({
    rootSelector: '.cart-list__body > .cart-table',
    scrapper: new ItemScrapper({
      name: '.title > a',
      imageUrl: 'img',
      availability: '.o-availability__value',
      availabilityRegex: /en stock/i,
      url: '.title > a',
      quantity: 'span.hida',
      price: '.o-product__price'
    })
  })

  configuratorScrapper = new ListScrapper({
    rootSelector: '.c-configuration__table tbody > tr',
    scrapper: new ConfiguratorItemScrapper({
      name: 'td:nth-child(2)',
      availability: 'td:first-child title',
      availabilityRegex: /en stock/i,
      quantity: 'td:nth-child(2)',
      price: 'td:nth-child(3)',
      rootListSelector: '.c-row__content',
      searchByNameSelector: '.c-meta__title',
      url: '.c-selected-product__meta > a',
      imageUrl: '.c-selected-product__thumb > img'
    })
  })

  sharedListScrapper = new ListScrapper({
    rootSelector: '.basket__body.show .order__body .order-table',
    scrapper: new ItemScrapper({
      name: '.order-cell--designation a',
      imageUrl: '.order-cell--pic > img',
      availability: '.order-cell--stock .o-availability__value',
      availabilityRegex: /en stock/i,
      url: '.order-cell--designation a',
      quantity: '.order-cell--quantity',
      price: '.order-cell--price'
    })
  })
}
