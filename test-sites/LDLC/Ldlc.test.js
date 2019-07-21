/*global page:true*/

import {
  clickOnElement,
  expectStringNotUndefinedOrEmpty,
  expectAttributeNotUndefinedOrEmpty
} from '../test_helper'
import SnapshotHelper from '../SnapshotHelper'
import { config } from '../config'

describe('LDLC', () => {
  let snapshot
  beforeAll(() => {
    snapshot = new SnapshotHelper('LDLC', page)
  })

  describe('Article Page', () => {
    beforeAll(async () => {
      jest.setTimeout(10000)
      await page.goto(config.ldlc.searchPage)
      await snapshot.take('recherche')
      await clickOnElement('.pdt-item a')
      await page.waitForNavigation()
      await snapshot.take('article')
    })

    it('should retrieve item title', async () => {
      await expectStringNotUndefinedOrEmpty('.title-1')
    })

    it('should retrieve item availability', async () => {
      await expectStringNotUndefinedOrEmpty('.stock')
    })

    it('should retrieve item price', async () => {
      await expectStringNotUndefinedOrEmpty('.price > .price')
    })

    it('should retrieve item image url', async () => {
      await expectAttributeNotUndefinedOrEmpty('.photodefault > img', 'src')
    })
  })

  describe('Cart Page', () => {
    beforeAll(async () => {
      jest.setTimeout(15000)
      await page.goto(config.ldlc.searchPage)
      await clickOnElement('.listing-product .pdt-item .icon-basket-add-bold')
      await page.waitForSelector('.basket-add')
      await page.goto(config.ldlc.cartPage)
      await snapshot.take('cart')
    })

    it('should retrieve one item', async () => {
      const items = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.cart-product-list .item'))
      })

      expect(items).toBeDefined()
      expect(items.length).toBe(1)
    })

    it('should retrieve item title', async () => {
      await expectStringNotUndefinedOrEmpty('.title > a')
    })

    it('should retrieve item availability', async () => {
      await expectStringNotUndefinedOrEmpty('.stock')
    })

    it('should retrieve item price', async () => {
      await expectStringNotUndefinedOrEmpty('.price')
    })

    it('should retrieve item url', async () => {
      await expectAttributeNotUndefinedOrEmpty('.title > a', 'href')
    })

    it('should retrieve item image url', async () => {
      await expectAttributeNotUndefinedOrEmpty('.pic > img', 'src')
    })

    it('should retrieve item quantity', async () => {
      await expectStringNotUndefinedOrEmpty('.quantity .multiSel')
    })
  })

  describe('Configurateur', () => {
    beforeAll(async () => {
      jest.setTimeout(20000)
      await page.goto(config.ldlc.configuratorPage)

      await addItemWithSelector('#component_1')
      await addItemWithSelector('#component_2')
      await addItemWithSelector('#component_3')

      await snapshot.take('configurateur-choice')
    })

    it('should retrieve 3 items', async () => {
      const items = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.sbloc li'))
      })

      expect(items).toBeDefined()
      expect(items.length).toBe(3)
    })

    it('should retrieve item title', async () => {
      await expectStringNotUndefinedOrEmpty('.name')
    })

    it('should retrieve item availability', async () => {
      await expectAttributeNotUndefinedOrEmpty('.stock', 'title')
    })

    it('should retrieve item price', async () => {
      await expectStringNotUndefinedOrEmpty('.price')
    })

    it('should retrieve item url', async () => {
      await expectAttributeNotUndefinedOrEmpty('.product > a', 'href')
    })

    it('should retrieve item image url', async () => {
      await expectAttributeNotUndefinedOrEmpty('.pic img', 'src')
    })
  })
})

async function addItemWithSelector(selector) {
  await clickOnElement(selector, 2000)
  await clickOnElement('.product-name', 500)
}
