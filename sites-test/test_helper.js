/*global page:true*/

export async function expectStringNotUndefinedOrEmpty(selector) {
  const string = await page.evaluate(selector => {
    return document.querySelector(selector).textContent.trim()
  }, selector)
  expect(string).toBeDefined()
  expect(string.length).toBeGreaterThan(0)
}

export async function expectAttributeNotUndefinedOrEmpty(selector, attribute) {
  const string = await page.evaluate((selector, attribute) => {
    return document.querySelector(selector).attributes.getNamedItem(attribute).textContent.trim()
  }, selector, attribute)

  expect(string).toBeDefined()
  expect(string.length).toBeGreaterThan(0)
}

export async function clickOnElement(selector, timeout = 0) {
  try {
    await page.click(selector)
    await page.waitFor(timeout)
  } catch (e) {
    console.error(e.message)
  }
}

export async function typeOnElement(selector, text) {
  await page.focus(selector)
  await page.keyboard.type(text)
}