import Article from '../../Models/Article'
import Cart from '../../Models/Cart'
import Scrapper from './Scrapper'

export default class ScrapperService {
  private scrappers: Scrapper[]

  constructor(scrappers: Scrapper[]) {
    this.scrappers = scrappers
  }

  getScrapperByName(name: string): Scrapper {
    return this.scrappers.find(scrapper => scrapper.reseller.name === name)
  }

  getCartFromCurrentPage = (url: string, doc: Document): Cart => {
    let cart: Cart

    this.scrappers.forEach(scrapper => {
      if (scrapper.canGetCartFromUrl(url))
        cart = scrapper.getCartFromUrl(url, doc)
    })

    return cart
  }

  getItemFromUrl = (url: string): Promise<Article> => {
    const scrapper = this.scrappers.find(scrapper =>
      scrapper.productUrl.test(url)
    )

    return scrapper.fromArticlePage(url)
  }
}
