import axios from 'axios';
import Component from '../../Models/Component';
import Config from '../../Models/Config';
import AbstractParser from './AbstractParser';

export default class LdlcParserV2 extends AbstractParser {
  reseller: ResellerInfo;
  config: ParserConfig;

  constructor(resellerInfo: ResellerInfo, config: ParserConfig) {
    super();
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

  fromCart(): Config {
    let config = new Config();

    const elements = this.getAllElements(
      document.body,
      '.cart-product-list .item'
    );

    Array.prototype.forEach.call(elements, parentNode => {
      let component = new Component();

      component.imageUrl = this.getElementAttribute(parentNode, {
        selector: '.pic > img',
        attribute: 'src',
        defaultValue: '#'
      });

      component.name = this.getElementAttribute(parentNode, {
        selector: '.title > a',
        attribute: 'innerText',
        defaultValue: ''
      });

      component.url =
        this.getElementAttribute(parentNode, {
          selector: '.title > a',
          attribute: 'href',
          defaultValue: ''
        }) + this.reseller.tag;

      component.instock =
        this.getElementAttribute(parentNode, {
          selector: '.stock',
          attribute: 'innerText',
          defaultValue: ''
        }) === 'EN STOCK';

      component.quantity = this.getElementAttribute(parentNode, {
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
        component.price = parseFloat(priceText.replace(/(CHF|\s|')/g, ''));
      else
        component.price = parseFloat(
          priceText.replace(/(€|\s)/g, '').replace(',', '.')
        );

      config.addComponent(component);
    });

    return config;
  }

  fromConfigurateur = (): Config => {
    let config = new Config();

    const recapElements = this.getAllElements(document.body, '.sbloc li');

    Array.prototype.forEach.call(recapElements, parentNode => {
      let component = new Component();

      component.instock =
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

      component.name = name;
      component.quantity = quantity;

      const priceText = this.getElementAttribute(parentNode, {
        selector: '.price',
        attribute: 'innerText',
        defaultValue: 1
      });

      let price;
      if (this.reseller.currency === 'CHF')
        price = parseFloat(priceText.replace(/(CHF|\s|')/g, ''));
      else price = parseFloat(priceText.replace('€', '.').replace(/\s/g, ''));

      component.price = price / quantity;

      config.addComponent(component);
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

      config.components = config.components.map(item => {
        if (name === item.name) {
          item.imageUrl = imageUrl;
          item.url = url;
        }
        return item;
      });
    });

    return config;
  };

  updateComponent = async (component: Component): Promise<Component> => {
    return axios.get(component.url).then(({ data }) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');

      const priceText = this.getElementAttribute(doc.body, {
        selector: '.price > .price',
        attribute: 'innerText',
        defaultValue: '0'
      });

      if (this.reseller.currency === 'CHF')
        component.price = parseFloat(priceText.replace(/(CHF|'|\s)/g, ''));
      else
        component.price = parseFloat(
          priceText.replace('€', '.').replace(/(\s)/g, '')
        );

      component.instock =
        this.getElementAttribute(doc.body, {
          selector: '.stock',
          attribute: 'innerText',
          defaultValue: false
        }) == 'En stock';

      return component;
    });
  };

  searchComponent = async (keys: SearchArgs): Promise<SearchResponse> => {
    const url = this.config.searchUrlTemplate(keys);
    console.log(url);

    return axios
      .get(url)
      .then(({ data }) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');

        const itemsCountString = this.getElementAttribute(doc.body, {
          selector: '.head-list .title-3',
          attribute: 'innerText',
          defaultValue: ''
        });

        const match = itemsCountString.match(/([0-9]+)/g);

        if (!match) return this.sendNoComponentsFound('Aucun élément trouvé');

        const itemsCount = parseInt(match[0]);
        const pageCount = Math.round(itemsCount / 48 + 0.5);

        let components: Array<Component> = [];

        const elements = this.getAllElements(
          doc.body,
          '.listing-product > ul:first-child > li'
        );

        Array.prototype.forEach.call(elements, parentNode => {
          let component = new Component();

          component.imageUrl = this.getElementAttribute(parentNode, {
            selector: '.pic img',
            attribute: 'src',
            defaultValue: '#'
          });

          component.name = this.getElementAttribute(parentNode, {
            selector: '.pdt-info .title-3',
            attribute: 'innerText',
            defaultValue: ''
          });

          const relativeUrl = this.getElementAttribute(parentNode, {
            selector: '.pdt-info a',
            innerAttribute: 'href',
            defaultValue: '#'
          });

          component.url = `https://www.ldlc.com${relativeUrl}${
            this.reseller.tag
          }`;

          component.instock =
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
            component.price = parseFloat(priceText.replace(/(CHF|\s|')/g, ''));
          else
            component.price = parseFloat(
              priceText.replace(/(€|\s)/g, '').replace(',', '.')
            );

          components.push(component);
        });

        return {
          pageCount,
          currentPage: keys.index,
          itemsCount,
          items: components
        };
      })
      .catch(error => {
        console.error(error);
        return this.sendNoComponentsFound(error.message);
      });
  };
}
