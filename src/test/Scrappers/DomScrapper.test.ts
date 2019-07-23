import DomScrapper from '../../services/Scrappers/DomScrapper'
import fs = require('fs')
import path = require('path')

describe('DomScrapper', () => {
  let domScrapper: DomScrapper
  beforeAll(() => {
    const content = fs.readFileSync(
      path.join(__dirname, './Amazon/pages/article.html'),
      'utf8'
    )
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    domScrapper = new DomScrapper(doc)
  })
  describe('textFrom', () => {
    it('should return empty string if selector not found', () => {
      expect(domScrapper.queryText('#test-de-id')).toBe('')
    })

    it('should return the correct text for the selector', () => {
      expect(domScrapper.queryText('#productTitle')).toBe(
        'Gigabyte GV-N208TGAMING OC-11GC Carte Graphique Nvidia GeForce RTX 2080 1545 MHz PCI Express'
      )
    })
  })

  describe('attributeFrom', () => {
    it('should return empty string if selector is not found', () => {
      expect(domScrapper.queryAttribute('#test-de-id', 'src')).toBe('')
    })

    it('should return empty string if selector exist but attribute not found', () => {
      expect(domScrapper.queryAttribute('#landingImage', 'data-test')).toBe('')
    })

    it('should return correct text', () => {
      expect(domScrapper.queryAttribute('#landingImage', 'src')).toBe(
        'https://images-na.ssl-images-amazon.com/images/I/613Vo1AivQL._SX679_.jpg'
      )

      expect(domScrapper.queryAttribute('.p13n-sc-truncated', 'title')).toBe(
        'Intel Core i9-9900K processeur 3,6 GHz Boîte 16 Mo Smart Cache - Processeurs (Intel Core i9-9xxx, 3,6 GHz, LGA 1151, PC, 14 nm, i9-9900K)'
      )
    })
  })

  describe('nodesFrom', () => {
    beforeAll(() => {
      const content = fs.readFileSync(
        path.join(__dirname, './LDLC/pages/configurator.html'),
        'utf8'
      )
      const parser = new DOMParser()
      const doc = parser.parseFromString(content, 'text/html')
      domScrapper = new DomScrapper(doc)
    })
    it('should return an empty array if selector not found', () => {
      expect(domScrapper.queryNodes('#selector-not-valid')).toStrictEqual([])
    })

    it('should return correct number of nodes', () => {
      expect(domScrapper.queryNodes('.sbloc li').length).toBe(5)
    })
  })
})
