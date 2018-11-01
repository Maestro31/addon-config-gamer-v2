import Config from '../../Models/Config';
import Component from '../../Models/Component';

export interface ParseResult {
  multiple: boolean;
  config?: Config;
  configs?: Config[];
}

export default abstract class AbstractParser {
  abstract reseller: ResellerInfo;

  abstract updateComponent(component: Component): Promise<any>;
  abstract searchComponent(keys: SearchArgs): Promise<SearchResponse>;

  getUrlFromTemplate(templateUrl: string, keys: SearchArgs): string {
    let url = templateUrl;
    Object.keys(keys).forEach(k => {
      if (k === 'categories') {
        keys[k].forEach((cat, i) => {
          url = url.replace(`{{cat-${i}}}`, cat);
        });
      } else url = url.replace(`{{${k}}}`, keys[k]);
    });

    url = url.replace(/({{([\w|\d-_]+)}})/g, '');
    console.log(url);
    return url;
  }

  getListElement(
    parentNode: Element,
    options: ParserOptions
  ): NodeListOf<Element> {
    return (
      parentNode.querySelectorAll(options.selector) || options.defaultValue
    );
  }

  getElementAttribute(parentNode: Element, options: ParserOptions): any {
    const el = <HTMLElement>parentNode.querySelector(options.selector);

    if (!el) return options.defaultValue;

    if (options.innerAttribute) {
      return el.getAttribute(options.innerAttribute) || options.defaultValue;
    }

    if (options.attribute === 'innerText' && options.noChildInnerText) {
      let child = <CharacterData>el.firstChild;
      let texts = [];
      while (child) {
        if (child.nodeType === 3) {
          texts.push(child.data);
        }
        child = <CharacterData>child.nextSibling;
      }
      return texts.join('') || options.defaultValue;
    }

    return el[options.attribute] || options.defaultValue;
  }

  updateConfig = (config: Config, callback: Function): void => {
    const configBefore = config.clone();

    let promises = [];
    for (let component of config.components) {
      promises.push(this.updateComponent(component));
    }

    Promise.all(promises).then(values => {
      config.components = values;

      const comparison = configBefore.compareConfig(config);
      console.log(comparison);

      config.modificationDate = new Date();
      callback(config, comparison);
    });
  };

  sendNoComponentsFound = (message: string): SearchResponse => {
    return {
      pageCount: 0,
      currentPage: 0,
      itemsCount: 0,
      items: [],
      error: message
    };
  };
}
