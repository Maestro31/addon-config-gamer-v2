import AbstractParser from './AbstractParser';
import Article from 'Models/Article';
import Axios from 'axios';

export default class AmazonParser extends AbstractParser {
  reseller: ResellerInfo;
  config: ParserParams;

  constructor(resellerInfo: ResellerInfo, config: ParserParams) {
    super();
    this.reseller = resellerInfo;
    this.config = config;
  }

  updateArticle(article: Article): Promise<any> {
    throw new Error('Method not implemented.');
  }

  searchArticle(keys: SearchArgs): Promise<SearchResponse> {
    throw new Error('Method not implemented.');
  }

  fromArticlePage = async (url: string): Promise<Article> => {
    return Axios.get(url)
      .then(({ data }) => {
        let article: Article = Article.create();

        return article;
      })
      .catch(error => {
        console.error(error.message);
        return null;
      });
  };
}
