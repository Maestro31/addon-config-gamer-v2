import TopAchatScrapper from '../../../services/Scrappers/TopAchat/TopAchatScrapper'

import path = require('path')
import FileHttpAdapter from '../../Adapters/FileHttpAdapter'
import Item from '../../../Models/Item'
import Cart from '../../../Models/Cart'
import { readDocumentFromFile } from '../../helpers'

describe('Top achat', () => {
  describe('Article Page', () => {
    let article: Item
    beforeAll(async () => {
      const topachat = new TopAchatScrapper(new FileHttpAdapter())
      article = await topachat.getItemFromItemPage(
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
      cart = topachat.getCartFromConfigurator(doc)
    })

    it('should retrieve the correct item count', () => {
      expect(cart.items.length).toBe(6)
    })

    it('should retrieve the correct item title', () => {
      expect(cart.items[0].name).toBe('Intel Core i9-9900X (3.5 GHz)')
    })

    it('should retrieve the correct item price', () => {
      expect(cart.items[0].price).toBe(1099.9)
      expect(cart.items[4].price).toBe(399.9)
    })

    it('should retrieve the correct item quantity', () => {
      expect(cart.items[0].quantity).toBe(1)
      expect(cart.items[4].quantity).toBe(2)
    })

    it('should retrieve the correct item url', () => {
      expect(cart.items[0].url).toBe(
        'https://www.topachat.com/pages/detail2_cat_est_micro_puis_rubrique_est_wpr_puis_ref_est_in10115958.html#ae51'
      )
    })

    it('should retrieve the correct item image url', () => {
      expect(cart.items[0].imageUrl).toBe(
        'https://www.topachat.com/boutique/img/in/in1011/in10115958/in1011595801.jpg'
      )
    })

    it('should retrieve the correct item availability', () => {
      expect(cart.items[0].available).toBeTruthy()
      expect(cart.items[1].available).toBeFalsy()
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
      cart = topachat.getCartFromCartPage(doc)
    })

    it('should retrieve the correct item count', () => {
      expect(cart.items.length).toBe(7)
    })

    it('should retrieve the correct item title', () => {
      expect(cart.items[0].name).toBe('AMD Ryzen 5 2600 (3.4 GHz)')
      expect(cart.items[1].name).toBe('Western Digital WD Black, 500 Go')
      expect(cart.items[2].name).toBe('Be Quiet ! Shadow Rock Slim')
      expect(cart.items[3].name).toBe(
        'DDR4 Ballistix Sport LT, Rouge, 4 Go, 2666 MHz, CAS 16'
      )
      expect(cart.items[4].name).toBe('Gigabyte X299 UD4 Pro')
    })

    it('should retrieve the correct item price', () => {
      expect(cart.items[0].price).toBe(139.9)
      expect(cart.items[5].price).toBe(399.9)
    })

    it('should retrieve the correct item url', () => {
      expect(cart.items[0].url).toBe(
        'https://www.topachat.com/pages/detail2_cat_est_micro_puis_rubrique_est_wpr_puis_ref_est_in10111461.html#ae51'
      )
    })

    it('should retrieve the correct item image url', () => {
      expect(cart.items[0].imageUrl).toBe(
        'https://www.topachat.com/boutique/img/in/in1011/in10111461/in1011146100.jpg'
      )
    })

    it('should retrieve the correct item quantity', () => {
      expect(cart.items[0].quantity).toBe(1)
      expect(cart.items[5].quantity).toBe(2)
    })

    it('should retrieve the correct item availability', () => {
      expect(cart.items[0].available).toBeTruthy()
      expect(cart.items[4].available).toBeFalsy()
    })

    it('should retrieve the correct cart total price whithout refund', () => {
      expect(Cart.getCartPriceWithoutRefund(cart)).toBe(2469.2)
    })

    it('should retrieve the correct cart total price whith refund', () => {
      expect(Cart.getCartPriceWithRefund(cart)).toBe(2345.74)
    })
  })
})
