import Article from '../../Models/Article';
import Cart from '../../Models/Cart';
import AbstractScrapper from './AbstractScrapper';
import HttpService from '../Http/HttpService';

export default class AmazonScrapper extends AbstractScrapper {
  reseller: ResellerInfo;
  config: ScrapperParams;

  constructor(resellerInfo: ResellerInfo, config: ScrapperParams, httpService: HttpService) {
    super(httpService);
    this.reseller = resellerInfo;
    this.config = config;
  }

  addResellerTag(url: any): string {
    const regex = /https:\/\/www\.amazon\.fr\/(.+\/)?[a-z]+\/(product\/)?([A-Z0-9]+)\/?/;
    const matches = regex.exec(url);

    if (matches) {
      return `${this.reseller.url}/dp/${matches[3]}/ref=nosim?tag=confgame-21`;
    }

    return url;
  }

  updateArticle(article: Article): Promise<any> {
    throw new Error('Method not implemented.');
  }

  searchArticle(keys: SearchArgs): Promise<SearchResponse> {
    throw new Error('Method not implemented.');
  }

  fromCart = (): Cart => {
    let cart = Cart.create();
    cart.reseller = this.reseller;

    let articleNodes = this.getAllElements(
      document.body,
      'div[data-name="Active Items"] .sc-list-item-content'
    );

    Array.prototype.forEach.call(articleNodes, parentNode => {
      let article = Article.create();
      article.reseller = this.reseller;

      article.available =
        this.getElementAttribute(parentNode, {
          selector: '.sc-product-availability',
          attribute: 'innerText'
        }).trim() === 'En stock';

      article.quantity = parseInt(
        this.getElementAttribute(parentNode, {
          selector: 'span.a-dropdown-prompt',
          defaultValue: '1',
          attribute: 'innerText'
        })
      );

      let price = this.getElementAttribute(parentNode, {
        selector: '.sc-price',
        defaultValue: '0',
        attribute: 'innerText'
      })
        .replace(',', '.')
        .replace('EUR', '')
        .trim();

      article.price = parseFloat(price) / article.quantity;

      article.name = this.getElementAttribute(parentNode, {
        selector: '.sc-product-title',
        defaultValue: '',
        attribute: 'innerText'
      });

      article.url = this.addResellerTag(
        this.getElementAttribute(parentNode, {
          selector: '.sc-product-link',
          defaultValue: '#',
          attribute: 'href'
        })
      );

      article.imageUrl = this.getElementAttribute(parentNode, {
        selector: '.sc-product-image',
        defaultValue: '#',
        attribute: 'src'
      });

      article.error = this.getElementAttribute(parentNode, {
        selector: '.error',
        defaultValue: '',
        attribute: 'innerText'
      });

      cart.articles.push(article);
    });

    cart.reseller = this.reseller;

    console.log(cart);
    return cart;
  };

  fromSharedList = (): Cart => {
    let cart = Cart.create();
    cart.reseller = this.reseller;

    let articleNodes = this.getAllElements(document.body, '#g-items > li');

    Array.prototype.forEach.call(articleNodes, parentNode => {
      let article = Article.create();
      article.reseller = this.reseller;

      article.available =
        this.getElementAttribute(parentNode, {
          selector: '.a-button-text',
          attribute: 'innerText'
        }).trim() === 'Ajouter au panier';

      let price = this.getElementAttribute(parentNode, {
        selector: '.a-price > .a-offscreen',
        defaultValue: '0',
        attribute: 'innerText'
      })
        .replace(',', '.')
        .replace('€', '')
        .trim();

      article.price = parseFloat(price) / article.quantity;

      article.name = this.getElementAttribute(parentNode, {
        selector: '.g-item-details .a-link-normal',
        defaultValue: '',
        attribute: 'innerText'
      }).trim();

      article.url = this.addResellerTag(
        this.getElementAttribute(parentNode, {
          selector: '.g-item-details .a-link-normal',
          defaultValue: '#',
          attribute: 'href'
        })
      );

      article.imageUrl = this.getElementAttribute(parentNode, {
        selector: '.g-itemImage img',
        defaultValue: '#',
        attribute: 'src'
      });

      cart.articles.push(article);
    });

    cart.reseller = this.reseller;

    console.log(cart);
    return cart;
  };

  fromArticlePage = async (url: string): Promise<Article> => {
    return this.http
      .get(url)
      .then((doc: Document) => {
        let article = Article.create();
        article.reseller = this.reseller;

        const price = this.getElementAttribute(doc.body, {
          selector: '#price_inside_buybox',
          attribute: 'innerText',
          defaultValue: '0'
        })
          .replace(',', '.')
          .replace(/\s|€/g, '')
          .trim();

        console.log(price)

        article.price = parseFloat(price);

        article.available =
          this.getElementAttribute(doc.body, {
            selector: '#availability > span',
            attribute: 'innerText',
            defaultValue: false
          }).trim() === 'En stock.';

        article.imageUrl = this.getElementAttribute(doc.body, {
          selector: '#landingImage',
          attribute: 'src',
          defaultValue: '#'
        });

        article.name = this.getElementAttribute(doc.body, {
          selector: '#productTitle',
          attribute: 'innerText',
          defaultValue: ''
        }).trim();

        article.url = this.addResellerTag(url);

        return article;
      })
      .catch(error => {
        console.error(error.message);
        return null;
      });
  };
}
