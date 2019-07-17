import Article from '../../Models/Article';
import Cart from '../../Models/Cart';
import AmazonScrapper from './AmazonScrapper';
import InfomaxScrapper from './InfomaxScrapper';
import LdlcScrapperV2 from './LdlcScrapperV2';
import MaterielNetScrapper from './MaterielNetScrapper';
import TopAchatScrapper from './TopAchatScrapper';

type Scrapper =
  | MaterielNetScrapper
  | TopAchatScrapper
  | InfomaxScrapper
  | LdlcScrapperV2
  | AmazonScrapper;

interface ParserMatch {
  regex: RegExp;
  scrapper: Scrapper;
  method?: Function;
}

export default class ScrapperService {
  public scrappers: Scrapper[];
  public matches: ParserMatch[];
  public productMatches: ParserMatch[];

  getScrapperByName(name: string): Scrapper {
    return this.scrappers.find(scrapper => scrapper.reseller.name === name);
  }

  retrieveCart = (): Cart => {
    const url = window.location.href;
    const matchScrapper = this.matches.find(
      match => !!url.match(match.regex)
    );
    return matchScrapper.method();
  };

  retrieveArticle = (url: string): Promise<Article> => {
    const matchScrapper = this.productMatches.find(
      match => !!url.match(match.regex)
    );

    return matchScrapper ? matchScrapper.scrapper.fromArticlePage(url) : null;
  };

  updateCart = (cart: Cart): Promise<Cart> => {
    for (let scrapper of this.scrappers) {
      if (cart.reseller.name === scrapper.reseller.name && scrapper.updateCart) {
        return scrapper.updateCart(cart);
      }
    }
  };

  searchArticle = (
    resellerName: string,
    keys: SearchArgs
  ): Promise<SearchResponse> => {
    return this.getScrapperByName(resellerName).searchArticle(keys);
  };
}