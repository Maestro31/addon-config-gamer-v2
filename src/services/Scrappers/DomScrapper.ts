export default class DomScrapper {
  document: Document | Element

  constructor(document: Document | Element) {
    this.document = document
  }

  public textFrom(selector: string) {
    const element = this.getElement(selector)

    if (!this.elementExist(element)) return ''

    return element.textContent.trim()
  }

  public attributeFrom(selector: string, attributeName: string) {
    const element = this.getElement(selector)

    if (!this.elementExist(element)) return ''

    const attribute = this.getAttribute(element, attributeName)

    if (!this.attributeExist(attribute)) return ''

    return attribute.textContent.trim()
  }

  public nodesFrom(selector: string) {
    return Array.from(this.document.querySelectorAll(selector))
  }

  private getElement(selector: string) {
    return this.document.querySelector(selector)
  }

  private getAttribute(element: Element, attributeName: string) {
    return element.attributes.getNamedItem(attributeName)
  }

  private attributeExist(attribute: Attr) {
    return attribute !== null
  }

  private elementExist(element: Element) {
    return element !== null
  }
}
