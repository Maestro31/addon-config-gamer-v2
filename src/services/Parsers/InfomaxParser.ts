import Component from '../../Models/Component';
import Config from '../../Models/Config';
import AbstractParser from './AbstractParser';

export default class InfomaxParser extends AbstractParser {
  reseller: ResellerInfo = {
    name: 'Infomax',
    url: 'https://www.infomaxparis.com',
    currency: 'EUR',
    tag: '#ae1'
  };

  config: ParserConfig = {
    matchesUrl: [
      {
        regex: /https:\/\/infomaxparis\.com\/commande/,
        methodName: 'fromCart'
      },
      {
        regex: /https:\/\/infomaxparis\.com\/achat-pc-gamer-configuration-fixes/,
        methodName: 'fromConfigurateur'
      }
    ]
  };

  searchComponent(keys: SearchArgs): Promise<SearchResponse> {
    throw new Error('Method not implemented.');
  }

  updateComponent(component: Component): Promise<Component> {
    return;
  }

  fromCart(): Config {
    throw new Error('Method not implemented.');
  }

  fromConfigurateur = (): Config => {
    let config = new Config();

    const refund = this.getElementAttribute(document.body, {
      selector: '.custom-product-savings > strong',
      attribute: 'innerText',
      defaultValue: 0
    });

    config.refund = refund.replace(/(\s|€)/g, '').replace(',', '.');

    const elements = this.getAllElements(
      document.body,
      '.panel-gray .remarketing--content-product-selected'
    );

    Array.prototype.forEach.call(elements, parentNode => {
      let component = new Component();
      component.name = this.getElementAttribute(parentNode, {
        selector: '.remarketing--content-product-title',
        attribute: 'innerHTML',
        defaultValue: ''
      });

      if (component.name === 'Sans') {
        return;
      }

      component.imageUrl = this.getElementAttribute(parentNode, {
        selector: '.remarketing--content-product-image > img',
        attribute: 'src',
        defaultValue: '#'
      });

      const price = this.getElementAttribute(parentNode, {
        selector: '.bundle-real-price',
        attribute: 'innerText',
        defaultValue: '0'
      });

      component.price = parseFloat(
        price.replace(/(\s|€)/g, '').replace(',', '.')
      );

      component.instock = true;

      config.addComponent(component);
    });
    console.log(config);
    return config;
  };
}
