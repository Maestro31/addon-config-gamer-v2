import Cart from '../../Models/Cart'
import Article from '../../Models/Article'
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

  protected itemScrapper: ItemScrapper

  protected cartScrapper: ListScrapper
  protected configuratorScrapper: ListScrapper
  protected sharedListScrapper: ListScrapper

  public productUrl: RegExp
  public reseller: Reseller

  public matches: UrlPattern[]

  constructor(httpService: HttpService = new Http()) {
    this.http = httpService
  }

  public canGetCartFromUrl(url: string): boolean {
    return !!this.matches.find(matchUrl => matchUrl.regex.test(url))
  }

  public getCartFromUrl(url: string, doc: Document): Cart {
    const match = this.matches.find(matchUrl => matchUrl.regex.test(url))

    if (!match)
      throw new Error('Url non valide ou revendeur non pris en charge')

    return match.method(doc)
  }

  protected getItemFrom(item: ItemScrapper) {
    let article = Article.create()
    article.reseller = this.reseller
    article.name = item.getName()
    article.price = item.getPrice()
    article.url = item.getUrl()
    article.imageUrl = item.getImageUrl()

    if (article.url != '' && !article.url.includes(this.reseller.url))
      article.url = this.reseller.url + article.url

    if (/^\/\//.test(article.imageUrl))
      article.imageUrl = 'https:' + article.imageUrl

    if (
      !article.imageUrl.includes('https://') &&
      !article.imageUrl.includes('data:image')
    )
      article.imageUrl = this.reseller.url + article.imageUrl

    article.url = this.addResellerTag(article.url)
    article.available = item.isAvailable()
    article.quantity = item.getQuantity()
    return article
  }

  protected getCartFrom(listScrapper: ListScrapper) {
    let cart = Cart.create()
    cart.reseller = this.reseller

    listScrapper.eachItem(itemScrapper => {
      let article = this.getItemFrom(itemScrapper)
      cart.articles.push(article)
    })

    return cart
  }

  protected addResellerTag(url: string) {
    return url + this.reseller.tag
  }

  public fromCart = (doc: Document): Cart => {
    this.cartScrapper.setRootNode(doc)
    return this.getCartFrom(this.cartScrapper)
  }

  public fromSharedList = (doc: Document): Cart => {
    this.sharedListScrapper.setRootNode(doc)
    return this.getCartFrom(this.sharedListScrapper)
  }

  public fromArticlePage = async (url: string): Promise<Article> => {
    return this.http
      .get(url)
      .then((doc: Document) => {
        this.itemScrapper.setRootNode(doc)
        let article = this.getItemFrom(this.itemScrapper)
        article.url = this.addResellerTag(url)
        return article
      })
      .catch(error => {
        console.error(error.message)
        return null
      })
  }

  public fromConfigurateur = (doc: Document): Cart => {
    this.configuratorScrapper.setRootNode(doc)
    return this.getCartFrom(this.configuratorScrapper)
  }
}
