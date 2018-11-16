import Cart from '../../Models/Cart';
import Article from '../../Models/Article';

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

  abstract updateArticle(article: Article): Promise<any>;
  abstract searchArticle(keys: SearchArgs): Promise<SearchResponse>;
  abstract fromArticlePage(url: string): Promise<Article>;

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

  updateCart = async (cart: Cart): Promise<Cart> => {

    let promises = [];
    for (let article of cart.articles) {
      promises.push(this.updateArticle(article));
    }

    return Promise.all(promises).then(values => {
      cart.articles = values;
      cart.modificationDate = new Date();
      return cart;
    });
  };

  sendNoArticleFound = (message: string): SearchResponse => {
    return {
      pageCount: 0,
      currentPage: 1,
      articlesCount: 0,
      articles: [],
      error: message
    };
  };
}
