import Cart from '../../Models/Cart';
import Article from '../../Models/Article';
import Config from '../../Models/Cart';
import AbstractParser from './AbstractParser';

export default class InfomaxParser extends AbstractParser {
  config: ParserParams;
  
  fromArticlePage(url: string): Promise<Article> {
    throw new Error('Method not implemented.');
  }

  reseller: ResellerInfo = {
    name: 'Infomax',
    url: 'https://www.infomaxparis.com/',
    currency: 'EUR',
    tag: '#ae1'
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
