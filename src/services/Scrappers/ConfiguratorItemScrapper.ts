import ItemScrapper, { ItemSelectors } from './ItemScrapper'

export default class ConfiguratorItemScrapper extends ItemScrapper {
  selectors: ItemSelectors

  getImageUrl() {
    return this.retrieveUrlByItemName(
      this.getName(),
      this.selectors.imageUrl,
      'src'
    )
  }

  getUrl() {
    return this.retrieveUrlByItemName(
      this.getName(),
      this.selectors.url,
      'href'
    )
  }

  protected retrieveUrlByItemName(
    name: string,
    selector: string,
    attribute: string
  ) {
    let url = ''

    this.forEachItemNodesFrom(this.selectors.rootListSelector, scrapper => {
      if (name === scrapper.queryText(this.selectors.searchByNameSelector))
        url = scrapper.queryAttribute(selector, attribute)
    })

    return url
  }
}
