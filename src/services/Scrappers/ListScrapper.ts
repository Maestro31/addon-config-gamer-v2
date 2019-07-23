import ItemScrapper from './ItemScrapper'

export interface ListScrapperOptions {
  rootSelector: string
  scrapper: ItemScrapper
}

export default class ListScrapper {
  options: ListScrapperOptions

  protected nodes: Element[]

  constructor(options: ListScrapperOptions) {
    this.options = options
  }

  public setRootNode(doc: Document) {
    this.nodes = Array.from(doc.querySelectorAll(this.options.rootSelector))
    this.options.scrapper.setRootNode(doc)
  }

  public eachItem(callback: (scrapper: ItemScrapper) => void) {
    this.nodes.forEach(node => {
      this.options.scrapper.setCurrentNode(node)
      callback(this.options.scrapper)
    })
  }
}
