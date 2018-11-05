import axios from 'axios';
import ComponentPC from '../../Models/ComponentPC';
import SetupPC from '../../Models/SetupPC';
import AbstractParser from './AbstractParser';

export default class LdlcParserV1 extends AbstractParser {
  reseller: ResellerInfo = {
    name: 'LDLC France',
    url: 'https://www.ldlc.com',
    currency: 'EUR',
    tag: '#aff764'
  };

  config: ParserConfig = {
    searchUrlTemplate: ({ index, text }: SearchArgs): string =>
      `https://www.ldlc.com/navigation-p${index}e48t5o1a1/${text}/`,
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

  fromCart(): SetupPC {
    let config = SetupPC.create();

    const elements = this.getAllElements(
      document.body,
      '.SecureTableGen .LigneProduit'
    );

    Array.prototype.forEach.call(elements, parentNode => {
      let component = ComponentPC.create();

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

      component.url =
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

      component.available =
        availability === 'Disponible en envoi immédiat' ||
        availability === 'Disponible';

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

      if (this.reseller.currency === 'CHF')
        component.price = parseFloat(priceText.replace(/(CHF|\s|')/g, ''));
      else
        component.price = parseFloat(
          priceText.replace(/(€|\s)/g, '').replace(',', '.')
        );

      config.components.push(component);
    });

    return config;
  }

  fromConfigurateur = (): SetupPC => {
    let config = SetupPC.create();

    const recapElements = this.getAllElements(document.body, '.summary li');

    Array.prototype.forEach.call(recapElements, parentNode => {
      let component = ComponentPC.create();

      component.available =
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
      if (this.reseller.currency === 'CHF')
        price = parseFloat(priceText.replace(/(CHF|\s|')/g, ''));
      else price = parseFloat(priceText.replace('€', '.').replace(/\s/g, ''));

      component.price = price / quantity;
      component.quantity = quantity;
      config.components.push(component);
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

  updateComponent = (component: ComponentPC): Promise<ComponentPC> => {
    return axios.get(component.url).then(({ data }) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');

      const priceText = this.getElementAttribute(doc.body, {
        selector: '.miniPrice',
        attribute: 'innerText',
        defaultValue: '0'
      });

      if (this.reseller.currency === 'CHF')
        component.price = parseFloat(priceText.replace(/(CHF|'|\s)/g, ''));
      else
        component.price = parseFloat(
          priceText.replace('€', '.').replace(/(\s)/g, '')
        );

      const availability = this.getElementAttribute(doc.body, {
        selector: '.miniDispo .dispo',
        attribute: 'innerText',
        defaultValue: false
      });

      component.available =
        availability === 'Disponible en envoi immédiat' ||
        availability === 'Disponible';

      return component;
    });
  };
}
