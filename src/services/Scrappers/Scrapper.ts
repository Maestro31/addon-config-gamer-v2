import Cart from '../../Models/Cart'
import Item from '../../Models/Item'
import Http from '../Adapters/Http'
import HttpService from '../Http/HttpService'
import ItemScrapper from './ItemScrapper'
import ListScrapper from './ListScrapper'

export interface UrlPattern {
  regex: RegExp
  method: Function
}

export default abstract class Scrapper {
  protected http = new Http()
  protected nextScrapper: Scrapper
  protected itemScrapper: ItemScrapper
  protected cartScrapper: ListScrapper
  protected configuratorScrapper: ListScrapper
  protected sharedListScrapper: ListScrapper
  protected productUrl: RegExp
  protected matches: UrlPattern[]
  protected reseller: Reseller

  constructor(httpService: HttpService = new Http()) {
    this.http = httpService
  }

  public setNextScrapper(scrapper: Scrapper) {
    if (!this.nextScrapper) {
      this.nextScrapper = scrapper
      return
    }

    this.nextScrapper.setNextScrapper(scrapper)
  }

  public getCartFromUrl(url: string, doc: Document): Cart {
    if (this.canGetCartFromUrl(url)) {
      return this.matches.find(matchUrl => matchUrl.regex.test(url)).method(doc)
    }

    if (this.nextScrapper) return this.nextScrapper.getCartFromUrl(url, doc)

    this.throwErrorNotValidUrl()
  }

  public getItemFromUrl(url: string): Promise<Item> {
    if (this.productUrl.test(url)) return this.getItemFromItemPage(url)

    if (this.nextScrapper) return this.nextScrapper.getItemFromUrl(url)

    this.throwErrorNotValidUrl()
  }

  protected getItem(scrapper: ItemScrapper) {
    let item = Item.create()
    item.reseller = this.reseller
    item.name = scrapper.getName()
    item.price = scrapper.getPrice()
    item.imageUrl = this.reformatUrl(scrapper.getImageUrl())
    const url = this.addResellerUrl(scrapper.getUrl())
    item.url = this.addResellerTag(url)
    item.available = scrapper.isAvailable()
    item.quantity = scrapper.getQuantity()
    return item
  }

  protected getCart(listScrapper: ListScrapper) {
    let cart = Cart.create()
    cart.reseller = this.reseller

    listScrapper.eachItem(itemScrapper => {
      let article = this.getItem(itemScrapper)
      cart.items.push(article)
    })

    return cart
  }

  protected reformatUrl(url: string) {
    if (this.isNotRelativeUrl(url) && this.isNotDataUrl(url))
      return this.addResellerUrl(url)

    return url.replace(/^\/\//, 'https://')
  }

  private isNotDataUrl(url: string) {
    return !url.includes('data:image')
  }

  private isNotRelativeUrl(url: string) {
    return /^\/[^\/]/.test(url)
  }

  protected addResellerUrl(url: string) {
    return url.includes(this.reseller.url) ? url : this.reseller.url + url
  }

  protected addResellerTag(url: string) {
    return url + this.reseller.tag
  }

  public getCartFromCartPage = (doc: Document): Cart => {
    this.cartScrapper.setRootNode(doc)
    return this.getCart(this.cartScrapper)
  }

  public getCartFromSharedList = (doc: Document): Cart => {
    this.sharedListScrapper.setRootNode(doc)
    return this.getCart(this.sharedListScrapper)
  }

  public getItemFromItemPage = async (url: string): Promise<Item> => {
    try {
      const doc = await this.http.get(url)
      this.itemScrapper.setRootNode(doc)
      return this.getItem(this.itemScrapper)
    } catch (error) {
      console.error(error.message)
      return null
    }
  }

  public getCartFromConfigurator = (doc: Document): Cart => {
    this.configuratorScrapper.setRootNode(doc)
    return this.getCart(this.configuratorScrapper)
  }

  private canGetCartFromUrl(url: string): boolean {
    return !!this.matches.find(matchUrl => matchUrl.regex.test(url))
  }

  private throwErrorNotValidUrl() {
    throw new Error('Url non valide ou revendeur non pris en charge')
  }
}
