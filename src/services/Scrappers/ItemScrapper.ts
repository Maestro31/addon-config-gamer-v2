import DomScrapper from './DomScrapper'

export interface ItemSelectors {
  name?: string
  imageUrl?: string
  availability?: string
  availabilityRegex?: RegExp
  url?: string
  quantity?: string
  price?: string
  availabilityAttribute?: string
  imageUrlAttribute?: string
  rootListSelector?: string
  searchByNameSelector?: string
}

export default class ItemScrapper {
  protected domScrapper: DomScrapper
  protected rootDocument: Document
  protected selectors: ItemSelectors

  constructor(selectors: ItemSelectors = null) {
    this.domScrapper = new DomScrapper(document)
    this.selectors = selectors
  }

  public getPrice() {
    const quantity = this.getQuantity()

    const price = this.domScrapper
      .queryText(this.selectors.price)
      .replace(/\s|EUR|CHF|\*/g, '')
      .replace(/,|€/g, '.')

    if (price === '') return 0

    const match = this.containQuantity(price)

    return match ? parseFloat(match[2]) : parseFloat(price) / quantity
  }

  public getName() {
    const name = this.domScrapper
      .queryText(this.selectors.name)
      .replace(/-$/, '')
      .replace(/(\s)\s/g, '')

    const match = this.containQuantity(name)
    return match ? match[2] : name
  }

  private containQuantity(string: string) {
    return string.match(/^([0-9])\s?x\s?(.+)$/)
  }

  public getImageUrl() {
    return this.selectors.imageUrlAttribute
      ? this.domScrapper.queryAttribute(
          this.selectors.imageUrl,
          this.selectors.imageUrlAttribute
        )
      : this.domScrapper.queryAttribute(this.selectors.imageUrl, 'src')
  }

  public isAvailable() {
    const availability = this.selectors.availabilityAttribute
      ? this.domScrapper.queryAttribute(
          this.selectors.availability,
          this.selectors.availabilityAttribute
        )
      : this.domScrapper
          .queryText(this.selectors.availability)
          .replace(/(\s)\s/g, '')

    return this.selectors.availabilityRegex
      ? this.selectors.availabilityRegex.test(availability)
      : availability !== ''
  }

  public getUrl() {
    return this.domScrapper.queryAttribute(this.selectors.url, 'href')
  }

  public getQuantity() {
    if (!this.selectors.quantity) return 1

    let quantityText = this.domScrapper.queryText(this.selectors.quantity)

    if (/^x[0-9]$/.test(quantityText))
      return parseInt(quantityText.replace('x', ''))

    const match = this.containQuantity(quantityText)
    if (match) return parseInt(match[1])

    if (this.isAPrice(quantityText)) return 1

    const quantity = parseInt(quantityText)
    return isNaN(quantity) ? 1 : quantity
  }

  private isAPrice(string: string) {
    return string.includes('€')
  }

  public setCurrentNode(node: Document | Element) {
    this.domScrapper = new DomScrapper(node)
  }

  public setRootNode(doc: Document) {
    this.rootDocument = doc
    this.domScrapper = new DomScrapper(doc)
  }

  protected forEachItemNodesFrom(
    selector: string,
    callback: (domScrapper: DomScrapper) => void
  ) {
    const rootScrapper = new DomScrapper(this.rootDocument)

    const nodesList = rootScrapper.queryNodes(selector)

    nodesList.forEach(node => {
      const nodeScrapper = new DomScrapper(node)
      callback(nodeScrapper)
    })
  }
}
