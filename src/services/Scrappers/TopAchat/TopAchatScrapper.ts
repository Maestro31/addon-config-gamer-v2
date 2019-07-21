import Cart from '../../../Models/Cart'
import Scrapper from '../Scrapper'
import ListScrapper from '../ListScrapper'
import ItemScrapper from '../ItemScrapper'

export default class TopAchatScrapper extends Scrapper {
  priceInfo =
    '*Panier éligible à 5% de réduction sur demande en MP sur FB ou Twitter à Top Achat'

  reseller: Reseller = {
    name: 'Top Achat',
    url: 'https://www.topachat.com',
    currency: 'EUR',
    tag: '#ae51'
  }

  productUrl = /https:\/\/www\.topachat\.com\/pages\/detail2_cat_est_.+_puis_.+_puis_ref_est_.+\.html/

  matches = [
    {
      regex: /https:\/\/www\.topachat\.com\/pages\/mon_panier\.php/,
      method: doc => this.fromCart(doc)
    },
    {
      regex: /https:\/\/www\.topachat\.com\/pages\/configomatic\.php/,
      method: doc => this.fromConfigurateur(doc)
    }
  ]

  itemScrapper = new ItemScrapper({
    name: '.libelle > h1',
    imageUrl: '.images > figure  img',
    availability: '#panier.en-stock',
    price: '#panier .priceFinal'
  })

  cartScrapper = new ListScrapper({
    rootSelector: '#recap tbody > tr',
    scrapper: new ItemScrapper({
      name: '.unstyled',
      imageUrl: 'img',
      availability: '.en-stock',
      url: '.unstyled',
      quantity: '.currQt',
      price: 'td:nth-child(5)'
    })
  })

  configuratorScrapper = new ListScrapper({
    rootSelector: '.hasProduct',
    scrapper: new ItemScrapper({
      name: '.configomatic__product-label',
      imageUrl: '.configomatic-product__image > img',
      availability: '.cfgo-availability',
      availabilityRegex: /en stock/i,
      url: '.configomatic-product__actions > a',
      quantity: '.configomatic-product__price',
      price: '.configomatic-product__price'
    })
  })

  protected getCartFrom(listScrapper: ListScrapper) {
    let cart = super.getCartFrom(listScrapper)
    return this.applyPriceWithRefoundIfGreatherThan1000(cart)
  }

  private applyPriceWithRefoundIfGreatherThan1000(cart: Cart) {
    const price = Cart.getCartPriceWithoutRefund(cart)
    if (price >= 1000) {
      cart.refundPercent = 5
      cart.priceInfo = this.priceInfo
    }

    return cart
  }
}
