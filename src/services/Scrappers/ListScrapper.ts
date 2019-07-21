import ItemScrapper from './ItemScrapper'

export interface ListScrapperOptions {
  rootSelector: string
  scrapper: ItemScrapper
}

export default class ListScrapper {
  options: ListScrapperOptions

  protected listNodes: Element[]

  constructor(options: ListScrapperOptions) {
    this.options = options
  }

  public setRootNode(document: Document) {
    this.listNodes = Array.from(
      document.querySelectorAll(this.options.rootSelector)
    )
    this.options.scrapper.setRootNode(document)
  }

  public eachItem(callback: (scrapper: ItemScrapper) => void) {
    this.listNodes.forEach(node => {
      this.options.scrapper.setCurrentNode(node)
      callback(this.options.scrapper)
    })
  }
}
