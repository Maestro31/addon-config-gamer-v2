import AmazonScrapper from '../services/Scrappers/Amazon/AmazonScrapper'
import LdlcScrapper from '../services/Scrappers/LDLC/LdlcScrapper'
import MaterielNetScrapper from '../services/Scrappers/MaterielNet/MaterielNetScrapper'
import TopAchatScrapper from '../services/Scrappers/TopAchat/TopAchatScrapper'
import { readDocumentFromFile } from './helpers'
import path = require('path')
import ScrapperService from '../services/Scrappers/ScrapperService'
import LdlcBEScrapper from '../services/Scrappers/LDLC/LdlcBEScrapper'
import LdlcESScrapper from '../services/Scrappers/LDLC/LdlcESScrapper'
import LdlcLUScrapper from '../services/Scrappers/LDLC/LdlcLUScrapper'
import LdlcCHScrapper from '../services/Scrappers/LDLC/LdlcCHScrapper'
import InMemoryHttpAdapter from './Adapters/InMemoryHttpAdapter'

describe('ScrapperService getCartFromCurrentPage', () => {
  let scrapper: ScrapperService
  beforeAll(() => {
    scrapper = new ScrapperService([
      new AmazonScrapper(),
      new MaterielNetScrapper(),
      new TopAchatScrapper(),
      new LdlcScrapper(),
      new LdlcBEScrapper(),
      new LdlcESScrapper(),
      new LdlcLUScrapper(),
      new LdlcCHScrapper()
    ])
  })

  describe('Amazon', () => {
    let cartDocument: Document
    let sharedCartDocument: Document
    beforeAll(() => {
      cartDocument = readDocumentFromFile(
        path.join(__dirname, './Scrappers/Amazon/pages/cart.html')
      )
      sharedCartDocument = readDocumentFromFile(
        path.join(__dirname, './Scrappers/Amazon/pages/shared-list.html')
      )
    })

    it('should use correct Scrapper and retrieve a cart from cart page', () => {
      const cart = scrapper.getCartFromCurrentPage(
        'https://www.amazon.fr/gp/cart/view.html?ref_=nav_cart',
        cartDocument
      )
      expect(cart.reseller.name).toBe('Amazon France')
      expect(cart.articles.length).toBe(4)
    })

    it('should correct Scrapper and retrieve a cart from shared list page', () => {
      const cart = scrapper.getCartFromCurrentPage(
        'https://www.amazon.fr/hz/wishlist/ls/9AZGL2YT7IBT/ref=nav_wishlist_lists_2?_encoding=UTF8&type=wishlist',
        sharedCartDocument
      )
      expect(cart.reseller.name).toBe('Amazon France')
      expect(cart.articles.length).toBe(10)
    })

    it('should retrieve the correct item url', () => {
      const cart = scrapper.getCartFromCurrentPage(
        'https://www.amazon.fr/gp/cart/view.html?ref_=nav_cart',
        cartDocument
      )

      expect(cart.articles[0].url).toBe(
        'https://www.amazon.fr/dp/B00RN3SJW8/ref=nosim?tag=confgame-21'
      )
    })
  })

  describe('Materiel.net', () => {
    let cartDocument: Document
    let configuratorDocument: Document
    let savedCartDocument: Document

    beforeAll(() => {
      cartDocument = readDocumentFromFile(
        path.join(__dirname, './Scrappers/MaterielNet/pages/cart.html')
      )
      configuratorDocument = readDocumentFromFile(
        path.join(__dirname, './Scrappers/MaterielNet/pages/configurator.html')
      )
      savedCartDocument = readDocumentFromFile(
        path.join(__dirname, './Scrappers/MaterielNet/pages/saved-cart.html')
      )
    })

    it('should correct Scrapper and retrieve a cart from cart page', () => {
      const cart = scrapper.getCartFromCurrentPage(
        'https://secure.materiel.net/Cart',
        cartDocument
      )
      expect(cart.reseller.name).toBe('Materiel.net')
      expect(cart.articles.length).toBe(5)
    })

    it('should correct Scrapper and retrieve a cart from saved cart page', () => {
      const cart = scrapper.getCartFromCurrentPage(
        'https://secure.materiel.net/Account/SavedCartsSection',
        savedCartDocument
      )
      expect(cart.reseller.name).toBe('Materiel.net')
      expect(cart.articles.length).toBe(5)
    })

    it('should correct Scrapper and retrieve a cart from configurator page', () => {
      const cart = scrapper.getCartFromCurrentPage(
        'https://www.materiel.net/configurateur-pc-sur-mesure/',
        configuratorDocument
      )
      expect(cart.reseller.name).toBe('Materiel.net')
      expect(cart.articles.length).toBe(5)
    })
  })

  describe('Top Achat', () => {
    let cartDocument: Document
    let configuratorDocument: Document

    beforeAll(() => {
      cartDocument = readDocumentFromFile(
        path.join(__dirname, './Scrappers/TopAchat/pages/cart.html')
      )
      configuratorDocument = readDocumentFromFile(
        path.join(__dirname, './Scrappers/TopAchat/pages/configurator.html')
      )
    })

    it('should correct Scrapper and retrieve a cart from cart page', () => {
      const cart = scrapper.getCartFromCurrentPage(
        'https://www.topachat.com/pages/mon_panier.php',
        cartDocument
      )
      expect(cart.reseller.name).toBe('Top Achat')
      expect(cart.articles.length).toBe(7)
    })

    it('should correct Scrapper and retrieve a cart from configurator page', () => {
      const cart = scrapper.getCartFromCurrentPage(
        'https://www.topachat.com/pages/configomatic.php?c=%2FLQ%2BPGCbehoFe7VdGC6%2BkhfhN%2BFedFI%2BE3K8qt7ITcI%3D',
        configuratorDocument
      )
      expect(cart.reseller.name).toBe('Top Achat')
      expect(cart.articles.length).toBe(6)
    })
  })

  describe('LDLC', () => {
    let cartDocument: Document
    let configuratorDocument: Document

    beforeAll(() => {
      cartDocument = readDocumentFromFile(
        path.join(__dirname, './Scrappers/LDLC/pages/cart.html')
      )
      configuratorDocument = readDocumentFromFile(
        path.join(__dirname, './Scrappers/LDLC/pages/configurator.html')
      )
    })

    it('should use LDLC FR and retrieve a cart from cart page', () => {
      const cart = scrapper.getCartFromCurrentPage(
        'https://secure2.ldlc.com/fr-fr/Cart',
        cartDocument
      )
      expect(cart.reseller.name).toBe('LDLC France')
      expect(cart.articles.length).toBe(3)
    })

    it('should use LDLC FR and retrieve a cart from configurator page', () => {
      const cart = scrapper.getCartFromCurrentPage(
        'https://www.ldlc.com/configurateur-pc/',
        configuratorDocument
      )
      expect(cart.reseller.name).toBe('LDLC France')
      expect(cart.articles.length).toBe(5)
    })

    it('should use LDLC BE and retrieve a cart from cart page', () => {
      const cart = scrapper.getCartFromCurrentPage(
        'https://secure2.ldlc.com/fr-be/Cart',
        cartDocument
      )
      expect(cart.reseller.name).toBe('LDLC Belgique')
      expect(cart.articles.length).toBe(3)
    })

    it('should use LDLC BE and retrieve a cart from configurator page', () => {
      const cart = scrapper.getCartFromCurrentPage(
        'https://www.ldlc.com/fr-be/configurateur-pc/',
        configuratorDocument
      )
      expect(cart.reseller.name).toBe('LDLC Belgique')
      expect(cart.articles.length).toBe(5)
    })

    it('should use LDLC ES and retrieve a cart from cart page', () => {
      const cart = scrapper.getCartFromCurrentPage(
        'https://secure2.ldlc.com/es-es/Cart',
        cartDocument
      )
      expect(cart.reseller.name).toBe('LDLC Espagne')
      expect(cart.articles.length).toBe(3)
    })

    it('should use LDLC ES and retrieve a cart from configurator page', () => {
      const cart = scrapper.getCartFromCurrentPage(
        'https://www.ldlc.com/es-es/configurateur-pc/',
        configuratorDocument
      )
      expect(cart.reseller.name).toBe('LDLC Espagne')
      expect(cart.articles.length).toBe(5)
    })

    it('should use LDLC ES and retrieve a cart from configurator page', () => {
      const cart = scrapper.getCartFromCurrentPage(
        'https://www.ldlc.com/es-es/configurador-pc/',
        configuratorDocument
      )
      expect(cart.reseller.name).toBe('LDLC Espagne')
      expect(cart.articles.length).toBe(5)
    })

    it('should use LDLC LU and retrieve a cart from cart page', () => {
      const cart = scrapper.getCartFromCurrentPage(
        'https://secure2.ldlc.com/fr-lu/Cart',
        cartDocument
      )
      expect(cart.reseller.name).toBe('LDLC Luxembourg')
      expect(cart.articles.length).toBe(3)
    })

    it('should use LDLC LU and retrieve a cart from configurator page', () => {
      const cart = scrapper.getCartFromCurrentPage(
        'https://www.ldlc.com/fr-lu/configurateur-pc/',
        configuratorDocument
      )
      expect(cart.reseller.name).toBe('LDLC Luxembourg')
      expect(cart.articles.length).toBe(5)
    })

    it('should use LDLC CH and retrieve a cart from cart page', () => {
      const cart = scrapper.getCartFromCurrentPage(
        'https://secure2.ldlc.com/fr-ch/Cart',
        cartDocument
      )
      expect(cart.reseller.name).toBe('LDLC Suisse')
      expect(cart.articles.length).toBe(3)
    })

    it('should use LDLC CH and retrieve a cart from configurator page', () => {
      const cart = scrapper.getCartFromCurrentPage(
        'https://www.ldlc.com/fr-ch/configurateur-pc/',
        configuratorDocument
      )
      expect(cart.reseller.name).toBe('LDLC Suisse')
      expect(cart.articles.length).toBe(5)
    })
  })
})

describe('ScrapperService getItemFromUrl', () => {
  let scrapper: ScrapperService
  let amazonDoc: Document
  let topachatDoc: Document
  let materielNetDoc: Document
  let ldcDoc: Document

  beforeAll(() => {
    amazonDoc = readDocumentFromFile(
      path.join(__dirname, './Scrappers/Amazon/pages/article.html')
    )

    topachatDoc = readDocumentFromFile(
      path.join(__dirname, './Scrappers/TopAchat/pages/article.html')
    )

    materielNetDoc = readDocumentFromFile(
      path.join(__dirname, './Scrappers/MaterielNet/pages/article.html')
    )

    ldcDoc = readDocumentFromFile(
      path.join(__dirname, './Scrappers/LDLC/pages/article.html')
    )

    scrapper = new ScrapperService([
      new AmazonScrapper(new InMemoryHttpAdapter(amazonDoc)),
      new MaterielNetScrapper(new InMemoryHttpAdapter(materielNetDoc)),
      new TopAchatScrapper(new InMemoryHttpAdapter(topachatDoc)),
      new LdlcScrapper(new InMemoryHttpAdapter(ldcDoc)),
      new LdlcBEScrapper(new InMemoryHttpAdapter(ldcDoc)),
      new LdlcESScrapper(new InMemoryHttpAdapter(ldcDoc)),
      new LdlcLUScrapper(new InMemoryHttpAdapter(ldcDoc)),
      new LdlcCHScrapper(new InMemoryHttpAdapter(ldcDoc))
    ])
  })

  it('should use Amazon', async () => {
    const article = await scrapper.getItemFromUrl(
      'https://www.amazon.fr/dp/B00RN3SJW8/?coliid=I3NS3IMJSSKJAQ&colid=9AZGL2YT7IBT&psc=1&ref_=lv_ov_lig_dp_it'
    )

    expect(article.reseller.name).toBe('Amazon France')
  })

  it('should use Materiel.net', async () => {
    const article = await scrapper.getItemFromUrl(
      'https://www.materiel.net/produit/201803300073.html'
    )

    expect(article.reseller.name).toBe('Materiel.net')
  })

  it('should use Top Achat', async () => {
    const article = await scrapper.getItemFromUrl(
      'https://www.topachat.com/pages/detail2_cat_est_peripheriques_puis_rubrique_est_w_moni_puis_ref_est_in10110967.html'
    )

    expect(article.reseller.name).toBe('Top Achat')
  })

  it('should use LDLC FR', async () => {
    const article = await scrapper.getItemFromUrl(
      'https://www.ldlc.com/fiche/PB00256785.html'
    )

    expect(article.reseller.name).toBe('LDLC France')
  })

  it('should use LDLC ES', async () => {
    const article = await scrapper.getItemFromUrl(
      'https://www.ldlc.com/es-es/fiche/PB00256785.html'
    )

    expect(article.reseller.name).toBe('LDLC Espagne')
  })

  it('should use LDLC BE', async () => {
    const article = await scrapper.getItemFromUrl(
      'https://www.ldlc.com/fr-be/fiche/PB00256785.html'
    )

    expect(article.reseller.name).toBe('LDLC Belgique')
  })

  it('should use LDLC LU', async () => {
    const article = await scrapper.getItemFromUrl(
      'https://www.ldlc.com/fr-lu/fiche/PB00256785.html'
    )

    expect(article.reseller.name).toBe('LDLC Luxembourg')
  })

  it('should use LDLC CH', async () => {
    const article = await scrapper.getItemFromUrl(
      'https://www.ldlc.com/fr-ch/fiche/PB00256785.html'
    )

    expect(article.reseller.name).toBe('LDLC Suisse')
  })
})
