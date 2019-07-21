import AmazonScrapper from '../../../services/Scrappers/Amazon/AmazonScrapper'
import FileHttpAdapter from '../../Adapters/FileHttpAdapter'
import Cart from '../../../Models/Cart'
import Article from '../../../Models/Article'
import path = require('path')

import { readDocumentFromFile } from '../../helpers'

describe('AmazonScrapper', () => {
  describe('Article Page', () => {
    let article: Article
    beforeAll(async () => {
      const amazon = new AmazonScrapper(new FileHttpAdapter())
      article = await amazon.fromArticlePage(
        path.join(__dirname, './pages/article.html')
      )
    })

    it('should retrieve article without error', async () => {
      expect(article).not.toBeNull()
    })

    it('should retrieve correct title', () => {
      expect(article.name).toBe(
        'Gigabyte GV-N208TGAMING OC-11GC Carte Graphique Nvidia GeForce RTX 2080 1545 MHz PCI Express'
      )
    })

    it('should retrieve correct price', () => {
      expect(article.price).toBe(1332.36)
    })

    it('should retrieve correct stock information', () => {
      expect(article.available).toBeTruthy()
    })

    it('should retrieve correct quantity information', () => {
      expect(article.quantity).toBe(1)
    })

    it('should retrieve correct image url', () => {
      expect(article.imageUrl).toBe(
        'https://images-na.ssl-images-amazon.com/images/I/613Vo1AivQL._SX679_.jpg'
      )
    })
  })

  describe('Shared List Page', () => {
    let cart: Cart
    beforeAll(() => {
      const amazon = new AmazonScrapper()
      const doc = readDocumentFromFile(
        path.join(__dirname, './pages/shared-list.html')
      )
      cart = amazon.fromSharedList(doc)
    })

    it('should retrieve the correct items number', () => {
      expect(cart.articles.length).toBe(10)
    })

    it('should retrieve de correct title for an item', () => {
      expect(cart.articles[0].name).toBe(
        'Gigabyte GV-N208TGAMING OC-11GC Carte Graphique Nvidia GeForce RTX 2080 1545 MHz PCI Express'
      )
    })

    it('should retrieve de correct url for an item', () => {
      expect(cart.articles[0].url).toBe(
        'https://www.amazon.fr/dp/B07GQY4HS1/ref=nosim?tag=confgame-21'
      )
    })

    it('should retrieve de correct quantity for an item', () => {
      expect(cart.articles[0].quantity).toBe(1)
    })

    it('should retrieve the correct price for an item', () => {
      expect(cart.articles[0].price).toBe(1259.99)
      expect(cart.articles[2].price).toBe(0)
    })

    it('should retrieve the correct availability for an item', () => {
      expect(cart.articles[0].available).toBeTruthy()
      expect(cart.articles[2].available).not.toBeTruthy()
    })

    it('should retrieve the correct total price', () => {
      expect(Cart.getCartPriceWithoutRefund(cart)).toBe(2258.26)
    })
  })

  describe('Cart Page', () => {
    let cart: Cart
    beforeAll(() => {
      const amazon = new AmazonScrapper()
      const doc = readDocumentFromFile(
        path.join(__dirname, './pages/cart.html')
      )
      cart = amazon.fromCart(doc)
    })

    it('should retrieve the correct items number', () => {
      expect(cart.articles.length).toBe(4)
    })

    it('should retrieve de correct title for an item', () => {
      expect(cart.articles[0].name).toBe(
        'NZXT CA-S340MB-GR Boîtier pour PC Noir/Rouge'
      )
    })

    it('should retrieve de correct url for an item', () => {
      expect(cart.articles[0].url).toBe(
        'https://www.amazon.fr/dp/B00RN3SJW8/ref=nosim?tag=confgame-21'
      )
    })

    it('should retrieve de correct image url for an item', () => {
      expect(cart.articles[0].imageUrl).toBe(
        'https://images-na.ssl-images-amazon.com/images/I/71hT-JzJ1yL._AC_AA100_.jpg'
      )
    })

    it('should retrieve the correct price for an item', () => {
      expect(cart.articles[0].price).toBe(511.29)
    })

    it('should retrieve the correct availability for an item', () => {
      expect(cart.articles[0].available).toBeTruthy()
      expect(cart.articles[2].available).not.toBeTruthy()
    })

    it('should retrieve the correct total price', () => {
      expect(Cart.getCartPriceWithoutRefund(cart)).toBe(1903.28)
    })
  })
})
