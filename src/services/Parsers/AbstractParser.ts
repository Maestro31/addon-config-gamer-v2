import SetupPC from '../../Models/SetupPC';
import ComponentPC from '../../Models/ComponentPC';

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
  onlyRootText?: boolean;
  defaultValue?: any;
}

export default abstract class AbstractParser {
  abstract reseller: ResellerInfo;
  abstract config: ParserParams;

  abstract updateComponentPC(component: ComponentPC): Promise<any>;
  abstract searchComponentPC(keys: SearchArgs): Promise<SearchResponse>;
  abstract fromProduct(url: string): Promise<ComponentPC>;

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

    if (options.attribute === 'innerText' && options.onlyRootText) {
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

  updateSetupPC = async (config: SetupPC): Promise<SetupPC> => {

    let promises = [];
    for (let component of config.components) {
      promises.push(this.updateComponentPC(component));
    }

    return Promise.all(promises).then(values => {
      config.components = values;
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
