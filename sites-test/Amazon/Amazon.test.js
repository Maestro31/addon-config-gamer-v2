/*global page:true*/

import {
  expectStringNotUndefinedOrEmpty,
  expectAttributeNotUndefinedOrEmpty,
  clickOnElement
} from '../test_helper'
import SnapshotHelper from '../SnapshotHelper'
import { config } from '../config'

describe('Amazon', () => {
  let snapshot
  beforeAll(() => {
    snapshot = new SnapshotHelper('Amazon', page)
  })

  describe('Article Page', () => {
    beforeAll(async () => {
      jest.setTimeout(15000)
      await page.goto(config.amazon.searchPage)
      await clickOnElement('.s-result-list .a-link-normal')
      await page.waitFor(2000)
      await snapshot.take('article')
    })

    it('should retrieve article title', async () => {
      await expectStringNotUndefinedOrEmpty('#productTitle')
    })

    it('should retrieve article price', async () => {
      await expectStringNotUndefinedOrEmpty('#price_inside_buybox')
    })

    it('should retrieve article availability', async () => {
      await expectStringNotUndefinedOrEmpty('#availability')
    })

    it('should retrieve article image url', async () => {
      await expectAttributeNotUndefinedOrEmpty('#landingImage', 'src')
    })
  })

  describe('Shared list Page', () => {
    beforeAll(async () => {
      await page.goto(config.amazon.wishList)
      await snapshot.take('shared-list')
    })

    it('should retrieve the correct number of items', async () => {
      const items = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('#g-items > li'))
      })

      expect(items).toBeDefined()
      expect(items.length).toBe(10)
    })

    it('should retrive the item title', async () => {
      await expectStringNotUndefinedOrEmpty(
        '#g-items .g-item-details .a-link-normal'
      )
    })

    it('should retrieve the item price', async () => {
      await expectStringNotUndefinedOrEmpty('#g-items .a-price > .a-offscreen')
    })

    it('should retrieve item availability', async () => {
      await expectStringNotUndefinedOrEmpty('#g-items .a-button-text')
    })

    it('should retrieve item url', async () => {
      await expectAttributeNotUndefinedOrEmpty(
        '#g-items .g-item-details .a-link-normal',
        'href'
      )
    })

    it('should retrieve item image url', async () => {
      await expectAttributeNotUndefinedOrEmpty(
        '#g-items .g-itemImage img',
        'src'
      )
    })
  })

  describe('Cart Page', () => {
    beforeAll(async () => {
      jest.setTimeout(20000)
      await page.goto(config.amazon.wishList)
      await page.waitForSelector('#g-items .a-button-text')
      await clickOnElement('#g-items .a-button-text:first-child')
      await page.waitForNavigation()
      await page.goto(config.amazon.cartPage)
      await snapshot.take('cart')
    })

    it('should display cart', async () => {
      expect(await page.title()).toBe('Amazon.fr Panier')
    })

    it('should display one item', async () => {
      const items = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(
            'div[data-name="Active Items"] .sc-list-item-content'
          )
        )
      })

      expect(items).toBeDefined()
      expect(items.length).toBe(1)
    })

    it('should retrieve item title', async () => {
      await expectStringNotUndefinedOrEmpty('.sc-product-title')
    })

    it('should retrieve item availability', async () => {
      await expectStringNotUndefinedOrEmpty('.sc-product-availability')
    })

    it('should retrieve item quantity', async () => {
      await expectStringNotUndefinedOrEmpty('.a-dropdown-prompt')
    })

    it('should retrieve item price', async () => {
      await expectStringNotUndefinedOrEmpty('.sc-price')
    })

    it('should retrieve item url', async () => {
      await expectAttributeNotUndefinedOrEmpty('.sc-product-link', 'href')
    })

    it('should retrieve item image url', async () => {
      await expectAttributeNotUndefinedOrEmpty('.sc-product-image', 'src')
    })
  })
})
