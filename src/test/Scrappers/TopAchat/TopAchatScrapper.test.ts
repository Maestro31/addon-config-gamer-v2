import TopAchatScrapper from '../../../services/Scrappers/TopAchat/TopAchatScrapper'

import path = require('path')
import FileHttpAdapter from '../../Adapters/FileHttpAdapter'
import Article from '../../../Models/Article'
import Cart from '../../../Models/Cart'
import { readDocumentFromFile } from '../../helpers'

describe('Top achat', () => {
  describe('Article Page', () => {
    let article: Article
    beforeAll(async () => {
      const topachat = new TopAchatScrapper(new FileHttpAdapter())
      article = await topachat.fromArticlePage(
        path.join(__dirname, './pages/article.html')
      )
    })

    it('should retrieve the correct item name', () => {
      expect(article.name).toBe(
        'DDR4 Corsair Vengeance RGB PRO, Noir, 32 Go (2 x 16 Go), 3200 MHz, CAS 16'
      )
    })

    it('should retrieve the correct item image url', () => {
      expect(article.imageUrl).toBe(
        'https://www.topachat.com/boutique/img/in/in1101/in11017548/in1101754802.jpg'
      )
    })

    it('should retrieve the correct item price', () => {
      expect(article.price).toBe(227.9)
    })

    it('should retrieve the correct item availability', () => {
      expect(article.available).toBeTruthy()
    })

    it('should retrieve the correct item quantity', () => {
      expect(article.quantity).toBe(1)
    })
  })

  describe('Configurator Page', () => {
    let cart: Cart
    beforeAll(() => {
      const topachat = new TopAchatScrapper()
      const doc = readDocumentFromFile(
        path.join(__dirname, './pages/configurator.html')
      )
      cart = topachat.fromConfigurateur(doc)
    })

    it('should retrieve the correct item count', () => {
      expect(cart.articles.length).toBe(6)
    })

    it('should retrieve the correct item title', () => {
      expect(cart.articles[0].name).toBe('Intel Core i9-9900X (3.5 GHz)')
    })

    it('should retrieve the correct item price', () => {
      expect(cart.articles[0].price).toBe(1099.9)
      expect(cart.articles[4].price).toBe(399.9)
    })

    it('should retrieve the correct item quantity', () => {
      expect(cart.articles[0].quantity).toBe(1)
      expect(cart.articles[4].quantity).toBe(2)
    })

    it('should retrieve the correct item url', () => {
      expect(cart.articles[0].url).toBe(
        'https://www.topachat.com/pages/detail2_cat_est_micro_puis_rubrique_est_wpr_puis_ref_est_in10115958.html#ae51'
      )
    })

    it('should retrieve the correct item image url', () => {
      expect(cart.articles[0].imageUrl).toBe(
        'https://www.topachat.com/boutique/img/in/in1011/in10115958/in1011595801.jpg'
      )
    })

    it('should retrieve the correct item availability', () => {
      expect(cart.articles[0].available).toBeTruthy()
      expect(cart.articles[1].available).toBeFalsy()
    })

    it('should retrieve the correct cart total price whithout refund', () => {
      expect(Cart.getCartPriceWithoutRefund(cart)).toBe(2329.3)
    })

    it('should retrieve the correct cart total price whith refund', () => {
      expect(Cart.getCartPriceWithRefund(cart)).toBe(2212.84)
    })
  })

  describe('Cart Page', () => {
    let cart: Cart
    beforeAll(() => {
      const topachat = new TopAchatScrapper()
      const doc = readDocumentFromFile(
        path.join(__dirname, './pages/cart.html')
      )
      cart = topachat.fromCart(doc)
    })

    it('should retrieve the correct item count', () => {
      expect(cart.articles.length).toBe(7)
    })

    it('should retrieve the correct item title', () => {
      expect(cart.articles[0].name).toBe('AMD Ryzen 5 2600 (3.4 GHz)')
      expect(cart.articles[1].name).toBe('Western Digital WD Black, 500 Go')
      expect(cart.articles[2].name).toBe('Be Quiet ! Shadow Rock Slim')
      expect(cart.articles[3].name).toBe(
        'DDR4 Ballistix Sport LT, Rouge, 4 Go, 2666 MHz, CAS 16'
      )
      expect(cart.articles[4].name).toBe('Gigabyte X299 UD4 Pro')
    })

    it('should retrieve the correct item price', () => {
      expect(cart.articles[0].price).toBe(139.9)
      expect(cart.articles[5].price).toBe(399.9)
    })

    it('should retrieve the correct item url', () => {
      expect(cart.articles[0].url).toBe(
        'https://www.topachat.com/pages/detail2_cat_est_micro_puis_rubrique_est_wpr_puis_ref_est_in10111461.html#ae51'
      )
    })

    it('should retrieve the correct item image url', () => {
      expect(cart.articles[0].imageUrl).toBe(
        'https://www.topachat.com/boutique/img/in/in1011/in10111461/in1011146100.jpg'
      )
    })

    it('should retrieve the correct item quantity', () => {
      expect(cart.articles[0].quantity).toBe(1)
      expect(cart.articles[5].quantity).toBe(2)
    })

    it('should retrieve the correct item availability', () => {
      expect(cart.articles[0].available).toBeTruthy()
      expect(cart.articles[4].available).toBeFalsy()
    })

    it('should retrieve the correct cart total price whithout refund', () => {
      expect(Cart.getCartPriceWithoutRefund(cart)).toBe(2469.2)
    })

    it('should retrieve the correct cart total price whith refund', () => {
      expect(Cart.getCartPriceWithRefund(cart)).toBe(2345.74)
    })
  })
})
