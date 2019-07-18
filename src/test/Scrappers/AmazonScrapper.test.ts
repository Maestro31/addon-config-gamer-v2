import AmazonScrapper from '../../services/Scrappers/AmazonScrapper'


describe('AmazonScrapper', () => {
  let amazon;
  let article;

  beforeAll(async () => {
    amazon = new AmazonScrapper()
    article = await amazon.fromArticlePage('https://www.amazon.fr/Gigabyte-GV-N208TGAMING-OC-11GC-Graphique-GeForce/dp/B07GQY4HS1')
  })

  it('should retrieve article without error', async () => {
    expect(article).not.toBeNull()
  })

  it('should retrieve correct title', () => {
    expect(article.name).toBe('Gigabyte GV-N208TGAMING OC-11GC Carte Graphique Nvidia GeForce RTX 2080 1545 MHz PCI Express')
  })

  it('should retrieve correct price', () => {
    expect(article.price).toBe(1259.99)
  })

  it('should retrieve correct stock information', () => {
    expect(article.available).toBeTruthy()
  })

  it('should retrieve correct quantity information', () => {
    expect(article.quantity).toBe(1)
  })

  it('should retrieve correct url information', () => {
    expect(article.url).toBe('https://www.amazon.fr/dp/B07GQY4HS1/ref=nosim?tag=confgame-21')
  })
})
