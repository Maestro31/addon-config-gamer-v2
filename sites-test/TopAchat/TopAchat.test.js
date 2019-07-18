/*global page:true*/

import {
  expectStringNotUndefinedOrEmpty,
  expectAttributeNotUndefinedOrEmpty,
  clickOnElement
} from '../test_helper'
import SnapshotHelper from '../SnapshotHelper'
import { config } from '../config'

describe('Top Achat', () => {
  let snapshot
  beforeAll(() => {
    snapshot = new SnapshotHelper('TopAchat', page)
  })

  describe('Article Page', () => {
    beforeAll(async () => {
      await page.goto(config.topAchat.searchPage)
      await clickOnElement('.link-visible a', 1000)
      await snapshot.take('article')
    })

    it('should retrieve article title', async () => {
      await expectStringNotUndefinedOrEmpty('.libelle > h1')
    })

    it('should retrieve article price', async () => {
      await expectStringNotUndefinedOrEmpty('#panier .priceFinal')
    })

    it('should retrieve article image url', async () => {
      await expectAttributeNotUndefinedOrEmpty('.images > figure  img', 'src')
    })

    it('should retrieve article availability', async () => {
      await expectStringNotUndefinedOrEmpty('#panier.en-stock')
    })
  })

  describe('Cart Page', () => {
    beforeAll(async () => {
      jest.setTimeout(10000)
      await page.goto(config.topAchat.searchPage)
      await snapshot.take('recherche')
      await clickOnElement('.link-visible a', 500)
      await snapshot.take('article-added')
      await clickOnElement('.panier .button', 500)
      await snapshot.take('cart')
    })

    it('should display one item', async () => {
      const items = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('#recap tbody > tr'))
      })

      expect(items).toBeDefined()
      expect(items.length).toBe(1)
    })

    it('should retrieve item title', async () => {
      await expectStringNotUndefinedOrEmpty('.unstyled')
    })

    it('should retrieve item image url', async () => {
      await expectAttributeNotUndefinedOrEmpty('img', 'src')
    })

    it('should retrieve item url', async () => {
      await expectAttributeNotUndefinedOrEmpty('.unstyled', 'href')
    })

    it('should retrieve item quantity', async () => {
      await expectStringNotUndefinedOrEmpty('.currQt')
    })

    it('should retrieve item availability', async () => {
      await expectStringNotUndefinedOrEmpty('.en-stock')
    })

    it('should retrieve item price', async () => {
      await expectStringNotUndefinedOrEmpty('td:nth-child(3)')
    })
  })

  describe('Configomatic', () => {
    beforeAll(async () => {
      jest.setTimeout(30000)
      await page.goto(config.topAchat.configuratorPage)
      await snapshot.take('configomatic')

      await addItemWithSelector('#selectPRO')
      await addItemWithSelector('#selectCME')
      await addItemWithSelector('#selectVEN')
      await addItemWithSelector('#selectGFX')
      await addItemWithSelector('#selectDRV2')
      await addItemWithSelector('#selectBOX')

      await snapshot.take('configomatic-choice')
    })

    it('should retrieve 6 articles', async () => {
      const items = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.hasProduct'))
      })

      expect(items).toBeDefined()
      expect(items.length).toBe(6)
    })

    it('should retrieve item title', async () => {
      await expectStringNotUndefinedOrEmpty('.configomatic__product-label')
    })

    it('should retrieve item url', async () => {
      await expectAttributeNotUndefinedOrEmpty(
        '.configomatic-product__actions > a',
        'href'
      )
    })

    it('should retrieve item image url', async () => {
      await expectAttributeNotUndefinedOrEmpty(
        '.configomatic-product__image > img',
        'src'
      )
    })

    it('should retrieve item price and quantity', async () => {
      await expectStringNotUndefinedOrEmpty('.configomatic-product__price')
    })

    it('should retrieve item price and quantity', async () => {
      await expectStringNotUndefinedOrEmpty('.cfgo-availability')
    })
  })
})

async function addItemWithSelector(selector) {
  await clickOnElement(selector)
  await page.waitForSelector('.vue-recycle-scroller__item-view')
  await clickOnElement('.vue-recycle-scroller__item-view', 200)
}
