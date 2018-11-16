import axios from 'axios';
import Cart from '../../Models/Cart';
import Article from '../../Models/Article';
import Config from '../../Models/Cart';
import AbstractParser from './AbstractParser';

export default class InfomaxParser extends AbstractParser {
  config: ParserParams;

  reseller: ResellerInfo = {
    name: 'Infomax',
    url: 'https://www.infomaxparis.com/',
    currency: 'EUR',
    tag: '#ae1'
  };

  fromArticlePage = async (url: string): Promise<Article> => {
    return axios
      .get(url)
      .then(({ data }) => {
        let article = Article.create();

        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');

        const price = this.getElementAttribute(doc.body, {
          selector: '.product--action-price-value',
          attribute: 'innerText',
          defaultValue: '0'
        })
          .replace(',', '.')
          .replace(/(\s|€)/g, '');

        article.price = parseFloat(price);
        article.available =
          this.getElementAttribute(doc.body, {
            selector: '.custom-product-available',
            attribute: 'innerText',
            defaultValue: false
          }) === ' EN STOCK';

        article.imageUrl =
          this.getElementAttribute(doc.body, {
            selector: '#bigpic',
            attribute: 'src',
            defaultValue: '#'
          }) + this.reseller.tag;

        article.name = this.getElementAttribute(doc.body, {
          selector: '.product--title > h1',
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

  searchArticle(keys: SearchArgs): Promise<SearchResponse> {
    throw new Error('Method not implemented.');
  }

  updateArticle(article: Article): Promise<Article> {
    return;
  }

  fromCart(): Cart {
    throw new Error('Method not implemented.');
  }

  fromConfigurateur = (): Cart => {
    let cart: Cart = Config.create();
    cart.reseller = this.reseller;

    const refund = this.getElementAttribute(document.body, {
      selector: '.custom-product-savings > strong',
      attribute: 'innerText',
      defaultValue: 0
    });

    cart.refund = refund.replace(/(\s|€)/g, '').replace(',', '.');

    const elements = this.getAllElements(
      document.body,
      '.panel-gray .remarketing--content-product-selected'
    );

    Array.prototype.forEach.call(elements, parentNode => {
      let article = Article.create();
      article.name = this.getElementAttribute(parentNode, {
        selector: '.remarketing--content-product-title',
        attribute: 'innerHTML',
        defaultValue: ''
      });

      if (article.name === 'Sans') {
        return;
      }

      article.imageUrl = this.getElementAttribute(parentNode, {
        selector: '.remarketing--content-product-image > img',
        attribute: 'src',
        defaultValue: '#'
      });

      const price = this.getElementAttribute(parentNode, {
        selector: '.bundle-real-price',
        attribute: 'innerText',
        defaultValue: '0'
      });

      article.price = parseFloat(
        price.replace(/(\s|€)/g, '').replace(',', '.')
      );

      article.available = true;

      cart.articles.push(article);
    });
    console.log(cart);
    return cart;
  };
}
