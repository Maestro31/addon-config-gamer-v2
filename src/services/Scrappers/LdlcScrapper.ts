import Article from '../../Models/Article';
import Cart from '../../Models/Cart';
import AbstractScrapper from './AbstractScrapper';

export default class LdlcScrapper extends AbstractScrapper {
  reseller: Reseller;
  config: ScrapperParams;

  constructor(resellerInfo: Reseller, config: ScrapperParams) {
    super()
    this.reseller = resellerInfo;
    this.config = config;
    this.reseller.tag = '#aff764';
    this.config.categoryList = [
      {
        label: 'Tous les rayons',
        value: 'all'
      },
      {
        label: 'Informatique',
        value: '3063'
      },
      {
        label: 'Image & Son',
        value: '3064'
      },
      {
        label: 'Téléphonie et Auto',
        value: '3065'
      },
      {
        label: 'Jeux et Loisirs',
        value: '3067'
      },
      {
        label: 'Objets connectés',
        value: '7641'
      },
      {
        label: 'Consommables',
        value: '3068'
      },
      {
        label: 'Connectique',
        value: '3888'
      }
    ];
  }

  fromCart(): Cart {
    let cart = Cart.create();
    cart.reseller = this.reseller;

    const elements = this.getAllElements(
      document.body,
      '.cart-product-list .item'
    );

    Array.prototype.forEach.call(elements, parentNode => {
      let article = Article.create();
      article.reseller = this.reseller;

      article.imageUrl = this.getElementAttribute(parentNode, {
        selector: '.pic > img',
        attribute: 'src',
        defaultValue: '#'
      });

      article.name = this.getElementAttribute(parentNode, {
        selector: '.title > a',
        attribute: 'innerText',
        defaultValue: ''
      });

      article.url =
        this.getElementAttribute(parentNode, {
          selector: '.title > a',
          attribute: 'href',
          defaultValue: ''
        }) + this.reseller.tag;

      article.available =
        this.getElementAttribute(parentNode, {
          selector: '.stock',
          attribute: 'innerText',
          defaultValue: ''
        }) === 'EN STOCK';

      article.quantity = this.getElementAttribute(parentNode, {
        selector: '.quantity .multiSel',
        attribute: 'innerText',
        defaultValue: 1
      });

      const priceText = this.getElementAttribute(parentNode, {
        selector: '.price',
        attribute: 'innerText',
        defaultValue: ''
      });

      if (this.reseller.currency === 'CHF')
        article.price = parseFloat(priceText.replace(/(CHF|\s|')/g, ''));
      else
        article.price = parseFloat(
          priceText.replace(/(€|\s)/g, '').replace(',', '.')
        );

      cart.articles.push(article);
    });

    return cart;
  }

  fromConfigurateur = (): Cart => {
    let cart = Cart.create();
    cart.reseller = this.reseller;

    const recapElements = this.getAllElements(document.body, '.sbloc li');

    Array.prototype.forEach.call(recapElements, parentNode => {
      let article = Article.create();
      article.reseller = this.reseller;

      article.available =
        this.getElementAttribute(parentNode, {
          selector: '.stock',
          attribute: 'title',
          defaultValue: ''
        }) === 'En stock';

      let name = this.getElementAttribute(parentNode, {
        selector: '.name',
        attribute: 'innerText',
        defaultValue: ''
      });

      const match = name.match(/^([0-9]+) x (.+)$/);

      let quantity = 1;
      if (match) {
        quantity = parseInt(match[1]);
        name = match[2];
      }

      article.name = name;
      article.quantity = quantity;

      const priceText = this.getElementAttribute(parentNode, {
        selector: '.price',
        attribute: 'innerText',
        defaultValue: 1
      });

      let price;
      if (this.reseller.currency === 'CHF')
        price = parseFloat(priceText.replace(/(CHF|\s|')/g, ''));
      else price = parseFloat(priceText.replace('€', '.').replace(/\s/g, ''));

      article.price = price / quantity;

      cart.articles.push(article);
    });

    const elements = this.getAllElements(document.body, '.elements .wrap-item');

    Array.prototype.forEach.call(elements, parentNode => {
      const imageUrl = this.getElementAttribute(parentNode, {
        selector: '.pic img',
        attribute: 'src',
        defaultValue: '#'
      });
      const name = this.getElementAttribute(parentNode, {
        selector: '.product .name',
        attribute: 'innerHTML',
        defaultValue: ''
      });
      const url =
        this.getElementAttribute(parentNode, {
          selector: '.product > a',
          attribute: 'href',
          defaultValue: '#'
        }) + this.reseller.tag;

      cart.articles = cart.articles.map(item => {
        if (name === item.name) {
          item.imageUrl = imageUrl;
          item.url = url;
        }
        return item;
      });
    });

    return cart;
  };

  fromArticlePage = async (url: string): Promise<Article> => {
    return this.http
      .get(url)
      .then((doc: Document) => {
        let article = Article.create();
        article.reseller = this.reseller;

        const priceText = this.getElementAttribute(doc.body, {
          selector: '.price > .price',
          attribute: 'innerText',
          defaultValue: '0'
        });

        if (this.reseller.currency === 'CHF')
          article.price = parseFloat(priceText.replace(/(CHF|'|\s)/g, ''));
        else
          article.price = parseFloat(
            priceText.replace('€', '.').replace(/(\s)/g, '')
          );

        article.available =
          this.getElementAttribute(doc.body, {
            selector: '.stock',
            attribute: 'innerText',
            defaultValue: false
          }) == 'En stock';

        article.imageUrl =
          this.getElementAttribute(doc.body, {
            selector: '.photodefault > img',
            attribute: 'src',
            defaultValue: '#'
          }) + this.reseller.tag;

        article.name = this.getElementAttribute(doc.body, {
          selector: '.title-1',
          attribute: 'innerText',
          defaultValue: ''
        });

        article.url = url + this.reseller.tag;

        return article;
      })
      .catch(error => {
        console.error(error.message);
        return null;
      });
  };

  updateArticle = async (article: Article): Promise<Article> => {
    return this.http.get(article.url).then((doc: Document) => {

      const priceText = this.getElementAttribute(doc.body, {
        selector: '.price > .price',
        attribute: 'innerText',
        defaultValue: '0'
      });

      if (this.reseller.currency === 'CHF')
        article.price = parseFloat(priceText.replace(/(CHF|'|\s)/g, ''));
      else
        article.price = parseFloat(
          priceText.replace('€', '.').replace(/(\s)/g, '')
        );

      article.available =
        this.getElementAttribute(doc.body, {
          selector: '.stock',
          attribute: 'innerText',
          defaultValue: false
        }) == 'En stock';

      return article;
    });
  };

  searchArticle = async (keys: SearchArgs): Promise<SearchResponse> => {
    const url = this.config.searchUrlTemplate(keys);
    console.log(url);

    return this.http
      .get(url)
      .then((doc: Document) => {

        const itemsCountString = this.getElementAttribute(doc.body, {
          selector: '.head-list .title-3',
          attribute: 'innerText',
          defaultValue: ''
        });

        const match = itemsCountString.match(/([0-9]+)/g);

        if (!match) return this.sendNoArticleFound('Aucun élément trouvé');

        const articlesCount = parseInt(match[0]);
        const pageCount = Math.round(articlesCount / 48 + 0.5);

        let articles: Array<Article> = [];

        const elements = this.getAllElements(
          doc.body,
          '.listing-product > ul:first-child > li'
        );

        Array.prototype.forEach.call(elements, parentNode => {
          let article = Article.create();

          article.imageUrl = this.getElementAttribute(parentNode, {
            selector: '.pic img',
            attribute: 'src',
            defaultValue: '#'
          });

          article.name = this.getElementAttribute(parentNode, {
            selector: '.pdt-info .title-3',
            attribute: 'innerText',
            defaultValue: ''
          });

          const relativeUrl = this.getElementAttribute(parentNode, {
            selector: '.pdt-info a',
            innerAttribute: 'href',
            defaultValue: '#'
          });

          article.url = `https://www.ldlc.com${relativeUrl}${
            this.reseller.tag
            }`;

          article.available =
            this.getElementAttribute(parentNode, {
              selector: '.wrap-stock a > span',
              attribute: 'innerText',
              defaultValue: ''
            }) == 'En stock';

          const priceText = this.getElementAttribute(parentNode, {
            selector: '.basket > .price > .price',
            attribute: 'innerText',
            defaultValue: '0'
          });

          if (this.reseller.currency === 'CHF')
            article.price = parseFloat(priceText.replace(/(CHF|\s|')/g, ''));
          else
            article.price = parseFloat(
              priceText.replace(/(€|\s)/g, '').replace(',', '.')
            );

          articles.push(article);
        });

        return {
          pageCount,
          currentPage: keys.index,
          articlesCount,
          articles
        };
      })
      .catch(error => {
        console.error(error);
        return this.sendNoArticleFound(error.message);
      });
  };
}
