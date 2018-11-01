import axios from 'axios';
import Component from '../../Models/Component';
import Config from '../../Models/Config';
import AbstractParser from './AbstractParser';

export default class LdlcParserV1 extends AbstractParser {
  reseller: ResellerInfo = {
    name: 'LDLC France',
    url: 'https://www.ldlc.com',
    monnaie: 'EUR',
    searchUrlTemplate:
      'https://www.ldlc.com/navigation-p{{index}}e48t5o1a1/{{text}}/',
    matchesUrl: [
      {
        regex: /https:\/\/www\.ldlc\.com\/Sales\/BasketPage\.aspx/,
        methodName: 'fromCart'
      },
      {
        regex: /https:\/\/www\.ldlc\.com\/configurateur-pc/,
        methodName: 'fromConfigurateur'
      }
    ]
  };

  searchComponent(keys: SearchArgs): Promise<SearchResponse> {
    throw new Error('Method not implemented.');
  }
  fromCart(): Config {
    let config = new Config();

    const elements = this.getListElement(document.body, {
      selector: '.SecureTableGen .LigneProduit',
      defaultValue: []
    });

    Array.prototype.forEach.call(elements, parentNode => {
      let component = new Component();

      component.imageUrl = this.getElementAttribute(parentNode, {
        selector: '.vignette > img',
        attribute: 'src',
        defaultValue: '#'
      });

      component.name = this.getElementAttribute(parentNode, {
        selector: '.dgnLongue > a',
        attribute: 'innerText',
        noChildInnerText: true,
        defaultValue: ''
      });

      component.url = this.getElementAttribute(parentNode, {
        selector: '.dgnLongue > a',
        attribute: 'href',
        defaultValue: '#'
      });

      const instock = this.getElementAttribute(parentNode, {
        selector: '.dispo',
        attribute: 'title',
        defaultValue: ''
      });

      component.instock =
        instock === 'Disponible en envoi immédiat' || instock === 'Disponible';

      component.quantity = parseInt(
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

      if (this.reseller.monnaie === 'CHF')
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

    const recapElements = this.getListElement(document.body, {
      selector: '.summary li',
      defaultValue: []
    });
    Array.prototype.forEach.call(recapElements, parentNode => {
      let component = new Component();

      component.instock =
        this.getElementAttribute(parentNode, {
          selector: '.dispo',
          attribute: 'title',
          defaultValue: ''
        }) === 'Stock web : disponible';

      component.name = this.getElementAttribute(parentNode, {
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
      if (this.reseller.monnaie === 'CHF')
        price = parseFloat(priceText.replace(/(CHF|\s|')/g, ''));
      else price = parseFloat(priceText.replace('€', '.').replace(/\s/g, ''));

      component.price = price / quantity;
      component.quantity = quantity;
      config.addComponent(component);
    });

    const elements = this.getListElement(document.body, {
      selector: '.product',
      defaultValue: []
    });
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
      const url = this.getElementAttribute(parentNode, {
        selector: 'div:nth-child(2) .itemUrl',
        attribute: 'href',
        defaultValue: '#'
      });

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

  updateComponent = (component: Component): Promise<Component> => {
    return axios.get(component.url).then(({ data }) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');

      const priceText = this.getElementAttribute(doc.body, {
        selector: '.miniPrice',
        attribute: 'innerText',
        defaultValue: '0'
      });

      if (this.reseller.monnaie === 'CHF')
        component.price = parseFloat(priceText.replace(/(CHF|'|\s)/g, ''));
      else
        component.price = parseFloat(
          priceText.replace('€', '.').replace(/(\s)/g, '')
        );

      const instock = this.getElementAttribute(doc.body, {
        selector: '.miniDispo .dispo',
        attribute: 'innerText',
        defaultValue: false
      });

      component.instock =
        instock === 'Disponible en envoi immédiat' || instock === 'Disponible';

      return component;
    });
  };
}
