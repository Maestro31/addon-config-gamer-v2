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
      .textFrom(this.selectors.price)
      .replace(/\s|EUR|CHF|\*/g, '')
      .replace(/,|€/g, '.')

    if (price == '') return 0

    const match = price.match(/^([0-9]+)x(.+)$/)
    if (match) return parseFloat(match[2].replace(/\s/g, ''))

    return parseFloat(price) / quantity
  }

  public getName() {
    const name = this.domScrapper
      .textFrom(this.selectors.name)
      .replace(/-$/, '')
      .replace(/(\s)\s/g, '')

    const match = name.match(/^([0-9]+) x (.+)$/)

    if (match) return match[2]

    return name
  }

  public getImageUrl() {
    if (this.selectors.imageUrlAttribute)
      return this.domScrapper.attributeFrom(
        this.selectors.imageUrl,
        this.selectors.imageUrlAttribute
      )

    return this.domScrapper.attributeFrom(this.selectors.imageUrl, 'src')
  }

  public isAvailable() {
    let availability: string

    if (this.selectors.availabilityAttribute)
      availability = this.domScrapper.attributeFrom(
        this.selectors.availability,
        this.selectors.availabilityAttribute
      )
    else
      availability = this.domScrapper
        .textFrom(this.selectors.availability)
        .replace(/(\s)\s/g, '')

    if (this.selectors.availabilityRegex)
      return this.selectors.availabilityRegex.test(availability)
    else return availability !== ''
  }

  public getUrl() {
    return this.domScrapper.attributeFrom(this.selectors.url, 'href')
  }

  public getQuantity() {
    if (!this.selectors.quantity) return 1

    let quantityText = this.domScrapper.textFrom(this.selectors.quantity)

    const match = quantityText.match(/^([0-9]+) x (.+)$/)
    if (match) return parseInt(match[1])

    quantityText = quantityText.replace('x', '')

    if (quantityText.includes('€')) return 1

    const quantity = parseInt(quantityText)
    if (isNaN(quantity)) return 1

    return quantity
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

    const nodesList = rootScrapper.nodesFrom(selector)

    nodesList.forEach(node => {
      const nodeScrapper = new DomScrapper(node)
      callback(nodeScrapper)
    })
  }
}
