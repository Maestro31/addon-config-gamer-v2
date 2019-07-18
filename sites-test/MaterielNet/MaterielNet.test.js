/*global page:true*/

import {
  expectStringNotUndefinedOrEmpty,
  expectAttributeNotUndefinedOrEmpty,
  clickOnElement,
  typeOnElement
} from '../test_helper'

import SnapshotHelper from '../SnapshotHelper'
import { config } from '../config'
import { credentials } from './credentials'

describe('Materiel.net', () => {
  let snapshot
  beforeAll(() => {
    snapshot = new SnapshotHelper('MaterielNet', page)
  })

  describe('Article Page', () => {
    beforeAll(async () => {
      jest.setTimeout(10000)

      await searchArticleAndGotoFirst()
      await snapshot.take('article')
    })

    it('should retrieve article title', async () => {
      await expectStringNotUndefinedOrEmpty('.c-product__header h1')
    })

    it('should retrieve article price', async () => {
      await expectStringNotUndefinedOrEmpty('.o-product__price')
    })

    it('should retrieve article availability', async () => {
      await expectStringNotUndefinedOrEmpty('.o-availability__value')
    })

    it('should retrieve article image url', async () => {
      await expectAttributeNotUndefinedOrEmpty(
        '.c-product__thumb > img',
        'data-src-large'
      )
    })
  })

  describe('Saved Cart', () => {
    beforeAll(async () => {
      jest.setTimeout(20000)

      await loginToMaterielNet(credentials.email, credentials.password)
      await createNewSavedCart()

      await snapshot.take('saved-cart')
    })

    it('should retrieve one article', async () => {
      const items = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(
            '.basket__body.show .order__body .order-table'
          )
        )
      })

      expect(items).toBeDefined()
      expect(items.length).toBe(1)
    })

    it('should retrieve article title', async () => {
      await expectStringNotUndefinedOrEmpty('.order-cell--designation a')
    })

    it('should retrieve article availability', async () => {
      await expectStringNotUndefinedOrEmpty(
        '.order-cell--stock .o-availability__value'
      )
    })

    it('should retrieve article quantity', async () => {
      await expectStringNotUndefinedOrEmpty('.order-cell--quantity')
    })

    it('should retrieve article price', async () => {
      await expectStringNotUndefinedOrEmpty('.order-cell--price')
    })

    it('should retrieve article url', async () => {
      await expectAttributeNotUndefinedOrEmpty(
        '.order-cell--designation a',
        'href'
      )
    })

    it('should retrieve article image url', async () => {
      await expectAttributeNotUndefinedOrEmpty('.order-cell--pic > img', 'src')
    })

    afterAll(async () => {
      await clickOnElement('.o-checkbox--alone', 200)
      await clickOnElement('#deletecart', 200)
      await clickOnElement('#modal-confirm-delete-basket a[data-ajax="true"]')
    })
  })

  describe('Configurateur', () => {
    beforeAll(async () => {
      jest.setTimeout(20000)
      await page.goto(config.materielNet.configuratorPage)

      await addItemWithSelector('#component_1')
      await addItemWithSelector('#component_2')
      await addItemWithSelector('#component_6')

      await snapshot.take('configurateur-choice')
    })

    it('should retrieve 3 items', async () => {
      const items = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.c-row__content'))
      })

      expect(items).toBeDefined()
      expect(items.length).toBe(3)
    })

    it('should retrieve article title', async () => {
      await expectStringNotUndefinedOrEmpty('.c-meta__title')
    })

    it('should retrieve article url', async () => {
      await expectAttributeNotUndefinedOrEmpty(
        '.c-selected-product__meta > a',
        'href'
      )
    })

    it('should retrieve article image url', async () => {
      await expectAttributeNotUndefinedOrEmpty(
        '.c-selected-product__thumb > img',
        'src'
      )
    })

    it('should retrieve article availability', async () => {
      await expectStringNotUndefinedOrEmpty(
        '.c-configuration__table tbody > tr td:first-child title'
      )
    })

    it('should retrieve article price', async () => {
      await expectStringNotUndefinedOrEmpty(
        '.c-configuration__table tbody > tr td:nth-child(3)'
      )
    })
  })
})

async function addItemWithSelector(selector) {
  await clickOnElement(selector, 2000)
  await clickOnElement('.c-body__product-name', 500)
}

async function checkIfCookieConsentModalIsOpenAndConfirm() {
  const cookieConsentIsOpen = await page.evaluate(() => {
    return (
      document.querySelector('#cookieConsentBannerClose').style.display ===
      'none'
    )
  })
  if (cookieConsentIsOpen)
    await clickOnElement('#cookieConsentBannerClose', 500)
}

async function loginToMaterielNet(email, password) {
  await page.goto(config.materielNet.loginPage)

  await checkIfCookieConsentModalIsOpenAndConfirm()

  await typeOnElement('#Email', email)
  await typeOnElement('#Password', password)
  await clickOnElement('button', 500)
}

async function searchArticleAndTakeFirst() {
  await page.goto(config.materielNet.searchPage)
  await clickOnElement('.o-btn__add-to-cart', 1000)
}

async function searchArticleAndGotoFirst() {
  await page.goto(config.materielNet.searchPage)
  await clickOnElement('.c-product__title', 2000)
}

async function createNewSavedCart() {
  await searchArticleAndTakeFirst()
  await page.goto(config.materielNet.cartPage)
  await clickOnElement('#action-save', 1000)
  await typeOnElement('#Name', 'Mon panier de test')
  await clickOnElement('.modal-footer button', 1000)
  await clickOnElement('.basket-cell--details > a', 500)
}
