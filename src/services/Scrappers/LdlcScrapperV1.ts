import Article from '../../Models/Article';
import Cart from '../../Models/Cart';
import AbstractScrapper from './AbstractScrapper';

export default class LdlcScrapperV1 extends AbstractScrapper {
  reseller: ResellerInfo = {
    name: 'LDLC France',
    url: 'https://www.ldlc.com',
    currency: 'EUR',
    tag: '#aff764'
  };

  config: ScrapperParams = {
    searchUrlTemplate: ({ index, text }: SearchArgs): string =>
      `https://www.ldlc.com/navigation-p${index}e48t5o1a1/${text}/`
  };

  searchArticle(keys: SearchArgs): Promise<SearchResponse> {
    throw new Error('Method not implemented.');
  }

  fromCart(): Cart {
    let cart = Cart.create();
    cart.reseller = this.reseller;

    const elements = this.getAllElements(
      document.body,
      '.SecureTableGen .LigneProduit'
    );

    Array.prototype.forEach.call(elements, parentNode => {
      let article = Article.create();
      article.reseller = this.reseller;

      article.imageUrl = this.getElementAttribute(parentNode, {
        selector: '.vignette > img',
        attribute: 'src',
        defaultValue: '#'
      });

      article.name = this.getElementAttribute(parentNode, {
        selector: '.dgnLongue > a',
        attribute: 'innerText',
        onlyRootText: true,
        defaultValue: ''
      });

      article.url =
        this.getElementAttribute(parentNode, {
          selector: '.dgnLongue > a',
          attribute: 'href',
          defaultValue: '#'
        }) + this.reseller.tag;

      const availability = this.getElementAttribute(parentNode, {
        selector: '.dispo',
        attribute: 'title',
        defaultValue: ''
      });

      article.available =
        availability === 'Disponible en envoi immédiat' ||
        availability === 'Disponible';

      article.quantity = parseInt(
        this.getElementAttribute(parentNode, {
          selector: '.quantity input',
          attribute: 'value',
          defaultValue: '1'
        })
      );

      const priceText = this.getElementAttribute(parentNode, {
        selector: '.ltPrice',
        attribute: 'innerText',
        defaultValue: '0'
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

    const recapElements = this.getAllElements(document.body, '.summary li');

    Array.prototype.forEach.call(recapElements, parentNode => {
      let article = Article.create();
      article.reseller = this.reseller;

      article.available =
        this.getElementAttribute(parentNode, {
          selector: '.dispo',
          attribute: 'title',
          defaultValue: ''
        }) === 'Stock web : disponible';

      article.name = this.getElementAttribute(parentNode, {
        selector: '.designation',
        attribute: 'title',
        defaultValue: ''
      });

      const quantity = parseInt(
        this.getElementAttribute(parentNode, {
          selector: '.designation span',
          attribute: 'innerText',
          defaultValue: '1'
        }).replace(' x', '')
      );

      const priceText = this.getElementAttribute(parentNode, {
        selector: 'span:nth-child(3)',
        attribute: 'innerText',
        defaultValue: '0'
      });

      let price;
      if (this.reseller.currency === 'CHF')
        price = parseFloat(priceText.replace(/(CHF|\s|')/g, ''));
      else price = parseFloat(priceText.replace('€', '.').replace(/\s/g, ''));

      article.price = price / quantity;
      article.quantity = quantity;
      cart.articles.push(article);
    });

    const elements = this.getAllElements(document.body, '.product');
    Array.prototype.forEach.call(elements, parentNode => {
      const imageUrl = this.getElementAttribute(parentNode, {
        selector: 'div:first-child .itemImage',
        attribute: 'src',
        defaultValue: '#'
      });
      const name = this.getElementAttribute(parentNode, {
        selector: 'div:nth-child(2) .itemName',
        attribute: 'title',
        defaultValue: ''
      });
      const url =
        this.getElementAttribute(parentNode, {
          selector: 'div:nth-child(2) .itemUrl',
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
          selector: '.miniPrice',
          attribute: 'innerText',
          defaultValue: '0'
        });

        if (this.reseller.currency === 'CHF')
          article.price = parseFloat(priceText.replace(/(CHF|'|\s)/g, ''));
        else
          article.price = parseFloat(
            priceText.replace('€', '.').replace(/(\s)/g, '')
          );

        const availability = this.getElementAttribute(doc.body, {
          selector: '.miniDispo .dispo',
          attribute: 'innerText',
          defaultValue: false
        });

        article.available =
          availability === 'Disponible en envoi immédiat' ||
          availability === 'Disponible';

        article.imageUrl =
          this.getElementAttribute(doc.body, {
            selector: '#productphoto img',
            attribute: 'src',
            defaultValue: '#'
          }) + this.reseller.tag;

        article.name = this.getElementAttribute(doc.body, {
          selector: '.designation_courte',
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

  updateArticle = (article: Article): Promise<Article> => {
    return this.http.get(article.url).then((doc: Document) => {

      const priceText = this.getElementAttribute(doc.body, {
        selector: '.miniPrice',
        attribute: 'innerText',
        defaultValue: '0'
      });

      if (this.reseller.currency === 'CHF')
        article.price = parseFloat(priceText.replace(/(CHF|'|\s)/g, ''));
      else
        article.price = parseFloat(
          priceText.replace('€', '.').replace(/(\s)/g, '')
        );

      const availability = this.getElementAttribute(doc.body, {
        selector: '.miniDispo .dispo',
        attribute: 'innerText',
        defaultValue: false
      });

      article.available =
        availability === 'Disponible en envoi immédiat' ||
        availability === 'Disponible';

      return article;
    });
  };
}
