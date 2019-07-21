export default class SnapshotHelper {
  constructor(dirname, page) {
    this.dirname = dirname
    this.page = page
  }

  async take(filename) {
    await this.page.screenshot({
      path: `test-sites/${this.dirname}/snapshots/${filename}.png`,
      fullPage: true
    })
  }
}
