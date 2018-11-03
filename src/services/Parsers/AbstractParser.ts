import Config from '../../Models/Config';
import Component from '../../Models/Component';

interface GetAttributeOptions {
  selector: string;
  attribute?:
    | 'innerText'
    | 'innerHTML'
    | 'src'
    | 'href'
    | 'title'
    | 'value'
    | 'checked'
    | 'id';
  innerAttribute?: string;
  noChildInnerText?: boolean;
  defaultValue?: any;
}

export default abstract class AbstractParser {
  abstract reseller: ResellerInfo;
  abstract config: ParserConfig;

  abstract updateComponent(component: Component): Promise<any>;
  abstract searchComponent(keys: SearchArgs): Promise<SearchResponse>;

  getAllElements(parentNode: Element, selector: string): NodeListOf<Element> {
    return parentNode.querySelectorAll(selector);
  }

  getElementAttribute(parentNode: Element, options: GetAttributeOptions): any {
    const targetNode = <HTMLElement>parentNode.querySelector(options.selector);

    if (!targetNode) return options.defaultValue;

    if (options.innerAttribute) {
      return (
        targetNode.getAttribute(options.innerAttribute) || options.defaultValue
      );
    }

    if (options.attribute === 'innerText' && options.noChildInnerText) {
      let child = <CharacterData>targetNode.firstChild;
      let texts = [];
      while (child) {
        if (child.nodeType === 3) {
          texts.push(child.data);
        }
        child = <CharacterData>child.nextSibling;
      }
      return texts.join('') || options.defaultValue;
    }

    return targetNode[options.attribute] || options.defaultValue;
  }

  updateConfig = async (config: Config): Promise<Config> => {
    const configBefore = config.clone();

    let promises = [];
    for (let component of config.components) {
      promises.push(this.updateComponent(component));
    }

    return Promise.all(promises).then(values => {
      config.components = values;

      // Comparaison non utilisée pour le moment
      // Fonctionnalité encore à créer
      const comparison = configBefore.compareConfig(config);
      console.log(comparison);

      config.modificationDate = new Date();
      return config;
    });
  };

  sendNoComponentsFound = (message: string): SearchResponse => {
    return {
      pageCount: 0,
      currentPage: 1,
      itemsCount: 0,
      items: [],
      error: message
    };
  };
}
