import LdlcScrapper from '../../../services/Scrappers/LDLC/LdlcScrapper'
import Item from '../../../Models/Item'
import FileHttpAdapter from '../../Adapters/FileHttpAdapter'
import path = require('path')
import { readDocumentFromFile } from '../../helpers'
import Cart from '../../../Models/Cart'

describe('LDLC Scrapper', () => {
  describe('Article Page', () => {
    let article: Item
    beforeAll(async () => {
      const ldlcScrapper = new LdlcScrapper(new FileHttpAdapter())
      article = await ldlcScrapper.getItemFromItemPage(
        path.join(__dirname, './pages/article.html')
      )
    })

    it('should retrieve the correct item title', () => {
      expect(article.name).toBe('Intel Core i9-9900K (3.6 GHz / 5.0 GHz)')
    })

    it('should retrieve the correct item price', () => {
      expect(article.price).toBe(539.95)
    })

    it('should retrieve the correct item image url', () => {
      expect(article.imageUrl).toBe(
        'https://media.ldlc.com/r1600/ld/products/00/05/04/91/LD0005049198_2.jpg'
      )
    })

    it('should retrieve the correct item availability', () => {
      expect(article.available).toBeTruthy()
    })

    it('should retrieve the correct item quantity', () => {
      expect(article.quantity).toBe(1)
    })
  })

  describe('Cart Page', () => {
    let cart: Cart
    beforeAll(async () => {
      const ldlcScrapper = new LdlcScrapper()
      const doc = readDocumentFromFile(
        path.join(__dirname, './pages/cart.html')
      )
      cart = ldlcScrapper.getCartFromCartPage(doc)
    })

    it('should retrieve the correct item count', () => {
      expect(cart.items.length).toBe(3)
    })

    it('should retrieve the correct item name', () => {
      expect(cart.items[0].name).toBe('Intel Core i9-9900K (3.6 GHz / 5.0 GHz)')
    })

    it('should retrieve the correct item quantity', () => {
      expect(cart.items[0].quantity).toBe(1)
      expect(cart.items[1].quantity).toBe(2)
    })

    it('should retrieve the correct item price', () => {
      expect(cart.items[0].price).toBe(539.95)
      expect(cart.items[1].price).toBe(139.95)
    })

    it('should retrieve the correct item availability', () => {
      expect(cart.items[0].available).toBeTruthy()
      expect(cart.items[2].available).toBeFalsy()
    })

    it('should retrieve the correct item url', () => {
      expect(cart.items[0].url).toBe(
        'https://www.ldlc.com/fiche/PB00256784.html#aff764'
      )
    })

    it('should retrieve the correct item image url', () => {
      expect(cart.items[0].imageUrl).toBe(
        'https://media.ldlc.com/r80/ld/products/00/05/04/91/LD0005049198_2.jpg'
      )
    })

    it('should retrieve the correct cart total price whithout refund', () => {
      expect(Cart.getCartPriceWithoutRefund(cart)).toBe(849.8)
    })
  })

  describe('Configurator Page', () => {
    let cart: Cart
    beforeAll(async () => {
      const ldlcScrapper = new LdlcScrapper()
      const doc = readDocumentFromFile(
        path.join(__dirname, './pages/configurator.html')
      )
      cart = ldlcScrapper.getCartFromConfigurator(doc)
    })

    it('should retrieve the correct item count', () => {
      expect(cart.items.length).toBe(5)
    })

    it('should retrieve the correct item name', () => {
      expect(cart.items[0].name).toBe('be quiet! Pure Rock Slim')
      expect(cart.items[1].name).toBe('MSI GeForce RTX 2080 GAMING X TRIO')
    })

    it('should retrieve the correct item quantity', () => {
      expect(cart.items[0].quantity).toBe(1)
      expect(cart.items[1].quantity).toBe(2)
    })

    it('should retrieve the correct item price', () => {
      expect(cart.items[0].price).toBe(29.95)
      expect(cart.items[1].price).toBe(799.94)
    })

    it('should retrieve the correct item availability', () => {
      expect(cart.items[0].available).toBeFalsy()
      expect(cart.items[1].available).toBeTruthy()
    })

    it('should retrieve the correct item url', () => {
      expect(cart.items[0].url).toBe(
        'https://www.ldlc.com/fiche/PB00216376.html#aff764'
      )
    })

    it('should retrieve the correct item image url', () => {
      expect(cart.items[0].imageUrl).toBe(
        'https://media.ldlc.com/r150/ld/products/00/03/95/50/LD0003955019_2.jpg'
      )
    })

    it('should retrieve the correct cart total price whithout refund', () => {
      expect(Cart.getCartPriceWithoutRefund(cart)).toBe(2419.68)
    })
  })
})
