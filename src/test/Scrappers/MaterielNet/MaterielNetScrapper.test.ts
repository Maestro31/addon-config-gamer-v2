import MaterielNetScrapper from '../../../services/Scrappers/MaterielNet/MaterielNetScrapper'
import Article from '../../../Models/Article'
import FileHttpAdapter from '../../Adapters/FileHttpAdapter'
import path = require('path')
import { readDocumentFromFile } from '../../helpers'
import Cart from '../../../Models/Cart'

describe('Materiel.net Scrapper', () => {
  describe('Article Page', () => {
    let article: Article
    beforeAll(async () => {
      const materielnetScrapper = new MaterielNetScrapper(new FileHttpAdapter())
      article = await materielnetScrapper.fromArticlePage(
        path.join(__dirname, './pages/article.html')
      )
    })

    it('should retrieve the correct item title', () => {
      expect(article.name).toBe('Intel Core i7 9700K')
    })

    it('should retrieve the correct item price', () => {
      expect(article.price).toBe(469.95)
    })

    it('should retrieve the correct item availability', () => {
      expect(article.available).toBeTruthy()
    })

    it('should retrieve the correct item quantity', () => {
      expect(article.quantity).toBe(1)
    })

    it('should retrieve the correct item image url', () => {
      expect(article.imageUrl).toBe(
        'https://media.materiel.net/r900/products/MN0005327656_1.jpg'
      )
    })
  })

  describe('Cart Page', () => {
    let cart: Cart
    beforeAll(async () => {
      const materielnetScrapper = new MaterielNetScrapper()
      const doc = readDocumentFromFile(
        path.join(__dirname, './pages/cart.html')
      )
      cart = materielnetScrapper.fromCart(doc)
    })

    it('should retrieve the correct item count', () => {
      expect(cart.articles.length).toBe(5)
    })

    it('should retrieve the correct item name', () => {
      expect(cart.articles[0].name).toBe('AMD Ryzen 7 3700X')
    })

    it('should retrieve the correct item quantity', () => {
      expect(cart.articles[0].quantity).toBe(1)
      expect(cart.articles[4].quantity).toBe(2)
    })

    it('should retrieve the correct item price', () => {
      expect(cart.articles[0].price).toBe(399.95)
      expect(cart.articles[4].price).toBe(799.94)
    })

    it('should retrieve the correct item availability', () => {
      expect(cart.articles[0].available).toBeTruthy()
      expect(cart.articles[3].available).toBeFalsy()
    })

    it('should retrieve the correct item url', () => {
      expect(cart.articles[0].url).toBe(
        'https://www.materiel.net/produit/201905310036.html#a_aid=aff764'
      )
    })

    it('should retrieve the correct item image url', () => {
      expect(cart.articles[0].imageUrl).toBe(
        'https://media.materiel.net/r80/products/MN0005368670_1.jpg'
      )
    })

    it('should retrieve the correct cart total price whithout refund', () => {
      expect(Cart.getCartPriceWithoutRefund(cart)).toBe(2698.68)
    })
  })

  describe('Saved Cart Page', () => {
    let cart: Cart
    beforeAll(async () => {
      const materielnetScrapper = new MaterielNetScrapper()
      const doc = readDocumentFromFile(
        path.join(__dirname, './pages/saved-cart.html')
      )
      cart = materielnetScrapper.fromSharedList(doc)
    })

    it('should retrieve the correct item count', () => {
      expect(cart.articles.length).toBe(5)
    })

    it('should retrieve the correct item name', () => {
      expect(cart.articles[0].name).toBe('Be Quiet DARK ROCK 4')
    })

    it('should retrieve the correct item quantity', () => {
      expect(cart.articles[0].quantity).toBe(1)
      expect(cart.articles[1].quantity).toBe(2)
    })

    it('should retrieve the correct item price', () => {
      expect(cart.articles[0].price).toBe(72.95)
      expect(cart.articles[1].price).toBe(799.94)
    })

    it('should retrieve the correct item availability', () => {
      expect(cart.articles[0].available).toBeTruthy()
      expect(cart.articles[3].available).toBeFalsy()
    })

    it('should retrieve the correct item url', () => {
      expect(cart.articles[0].url).toBe(
        'https://www.materiel.net/produit/201803300073.html#a_aid=aff764'
      )
    })

    it('should retrieve the correct item image url', () => {
      expect(cart.articles[0].imageUrl).toBe(
        'https://media.materiel.net/r80/oproducts/AR201803300073_g1.jpg'
      )
    })

    it('should retrieve the correct cart total price whithout refund', () => {
      expect(Cart.getCartPriceWithoutRefund(cart)).toBe(2698.68)
    })
  })

  describe('Configurator Page', () => {
    let cart: Cart
    beforeAll(async () => {
      const materielnetScrapper = new MaterielNetScrapper()
      const doc = readDocumentFromFile(
        path.join(__dirname, './pages/configurator.html')
      )
      cart = materielnetScrapper.fromConfigurateur(doc)
    })

    it('should retrieve the correct item count', () => {
      expect(cart.articles.length).toBe(5)
    })

    it('should retrieve the correct item name', () => {
      expect(cart.articles[0].name).toBe('Be Quiet DARK ROCK 4')
    })

    it('should retrieve the correct item quantity', () => {
      expect(cart.articles[0].quantity).toBe(1)
      expect(cart.articles[2].quantity).toBe(2)
    })

    it('should retrieve the correct item price', () => {
      expect(cart.articles[0].price).toBe(72.95)
      expect(cart.articles[2].price).toBe(799.94)
    })

    it('should retrieve the correct item availability', () => {
      expect(cart.articles[0].available).toBeTruthy()
      expect(cart.articles[4].available).toBeFalsy()
    })

    it('should retrieve the correct item url', () => {
      expect(cart.articles[0].url).toBe(
        'https://www.materiel.net/produit/201803300073.html#a_aid=aff764'
      )
    })

    it('should retrieve the correct item image url', () => {
      expect(cart.articles[0].imageUrl).toBe(
        'https://media.materiel.net/r150/oproducts/AR201803300073_g1.jpg'
      )
    })
  })
})
