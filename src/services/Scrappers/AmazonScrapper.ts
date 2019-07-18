import Article from '../../Models/Article';
import Cart from '../../Models/Cart';
import AbstractScrapper from './AbstractScrapper';

export default class AmazonScrapper extends AbstractScrapper {
  reseller: Reseller = {
    name: 'Amazon France',
    url: 'https://www.amazon.fr',
    currency: 'EUR'
  };

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
          selector: '.a-dropdown-prompt',
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

        let price = doc.querySelector("#price_inside_buybox").textContent
        price = price.replace(',', '.').replace(/[\s|€]/g, '').trim()
        article.price = parseFloat(price);

        article.available =
          doc.querySelector("#availability > span").textContent.trim() === 'En stock.';

        article.imageUrl = doc.querySelector("#landingImage").attributes.getNamedItem('src').textContent.trim()

        article.name = doc.querySelector("#productTitle").textContent.trim()
        article.url = this.addResellerTag(url);

        return article;
      })
      .catch(error => {
        console.error(error.message);
        return null;
      });
  };

  copyArticle = (document, url): Article => {

    let article = Article.create();
    article.reseller = this.reseller;

    let price = document.querySelector("#price_inside_buybox").textContent
    price = price.replace(',', '.').replace(/[\s|€]/g, '').trim()
    article.price = parseFloat(price);

    article.available =
      document.querySelector("#availability > span").textContent.trim() === 'En stock.';

    article.imageUrl = document.querySelector("#landingImage").attributes.getNamedItem('src').textContent.trim()

    article.name = document.querySelector("#productTitle").textContent.trim()
    article.url = this.addResellerTag(url);

    return article;
  }
}
