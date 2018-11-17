import MaterielNetParser from './MaterielNetParser';
import TopAchatParser from './TopAchatParser';
import LdlcParserV1 from './LdlcParserV1';
import LdlcParserV2 from './LdlcParserV2';
import InfomaxParser from './InfomaxParser';
import Cart from '../../Models/Cart';
import Article from '../../Models/Article';
import AmazonParser from './AmazonParser';

type Parser =
  | MaterielNetParser
  | TopAchatParser
  | InfomaxParser
  | LdlcParserV1
  | LdlcParserV2
  | AmazonParser;

interface ParserMatch {
  regex: RegExp;
  parser: Parser;
  method?: Function;
}

export default class ParserService {
  static parsers: Parser[];
  static matches: ParserMatch[];
  static productMatches: ParserMatch[];

  static getParserByName(name: string): Parser {
    return ParserService.parsers.find(parser => parser.reseller.name === name);
  }

  static parseCart = (): Cart => {
    const url = window.location.href;
    const matchParser = ParserService.matches.find(
      match => !!url.match(match.regex)
    );
    return matchParser.method();
  };

  static parseArticle = (url: string): Promise<Article> => {
    const matchParser = ParserService.productMatches.find(
      match => !!url.match(match.regex)
    );
    return matchParser ? matchParser.parser.fromArticlePage(url) : null;
  };

  static updateCart = (config): Promise<Cart> => {
    for (let parser of ParserService.parsers) {
      if (config.reseller.name === parser.reseller.name && parser.updateCart) {
        return parser.updateCart(config);
      }
    }
  };

  static searchArticle = (
    resellerName: string,
    keys: SearchArgs
  ): Promise<SearchResponse> => {
    return ParserService.getParserByName(resellerName).searchArticle(keys);
  };
}

/**
 * Liste des parsers pour chaque revendeur
 */

const materielNetParser = new MaterielNetParser();
const topAchatParser = new TopAchatParser();
const infomaxParser = new InfomaxParser();
const ldlcParserV1 = new LdlcParserV1();
const ldlcParserV2ES = new LdlcParserV2(
  {
    name: 'LDLC Espagne',
    url: 'https://www.ldlc.com/es-es',
    currency: 'EUR'
  },
  {
    searchUrlTemplate: ({ text, index, categories }: SearchArgs): string =>
      `https://www.ldlc.com/v4/es-es/search/product/${text}/ftxt-/${index}?department=${
        categories[0]
      }`
  }
);
const ldlcParserV2CH = new LdlcParserV2(
  {
    name: 'LDLC Suisse',
    url: 'https://www.ldlc.ch',
    currency: 'CHF'
  },
  {
    searchUrlTemplate: ({ text, index, categories }: SearchArgs): string =>
      `https://www.ldlc.com/v4/fr-ch/search/product/${text}/ftxt-/${index}?department=${
        categories[0]
      }`
  }
);

const ldlcParserV2LU = new LdlcParserV2(
  {
    name: 'LDLC Luxembourg',
    url: 'https://www.ldlc.com/fr-lu',
    currency: 'EUR'
  },
  {
    searchUrlTemplate: ({ text, index, categories }: SearchArgs): string =>
      `https://www.ldlc.com/v4/fr-lu/search/product/${text}/ftxt-/${index}?department=${
        categories[0]
      }`
  }
);

const ldlcParserV2BE = new LdlcParserV2(
  {
    name: 'LDLC Belgique',
    url: 'https://www.ldlc.com/fr-be',
    currency: 'EUR'
  },
  {
    searchUrlTemplate: ({ text, index, categories }: SearchArgs): string =>
      `https://www.ldlc.com/v4/fr-be/search/product/${text}/ftxt-/${index}?department=${
        categories[0]
      }`
  }
);

const amazonParserFR = new AmazonParser(
  {
    name: 'Amazon France',
    url: 'https://www.amazon.fr',
    currency: 'EUR'
  },
  {
    searchUrlTemplate: () => ''
  }
);

ParserService.parsers = [
  materielNetParser,
  topAchatParser,
  infomaxParser,
  ldlcParserV1,
  ldlcParserV2BE,
  ldlcParserV2CH,
  ldlcParserV2ES,
  ldlcParserV2LU,
  amazonParserFR
];

ParserService.productMatches = [
  {
    regex: /https:\/\/www\.amazon\.fr\/(.+\/)?[a-z]+\/(product\/)?[A-Z0-9]+/,
    parser: amazonParserFR
  },
  {
    regex: /https:\/\/www\.materiel\.net\/produit\/[0-9]+\.html/,
    parser: materielNetParser
  },
  {
    regex: /https:\/\/www\.topachat\.com\/pages\/detail2_cat_est_.+_puis_.+_puis_ref_est_.+\.html/,
    parser: topAchatParser
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fiche\/[A-Z0-9]+\.html/,
    parser: ldlcParserV1
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fr-ch\/fiche\/[A-Z0-9]+\.html/,
    method: ldlcParserV2CH.fromArticlePage,
    parser: ldlcParserV2CH
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fr-be\/fiche\/[A-Z0-9]+\.html/,
    parser: ldlcParserV2BE
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fr-lu\/fiche\/[A-Z0-9]+\.html/,
    parser: ldlcParserV2LU
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/es-es\/fiche\/[A-Z0-9]+\.html/,
    parser: ldlcParserV2ES
  },
  {
    regex: /https:\/\/infomaxparis.com/,
    parser: infomaxParser
  }
];

ParserService.matches = [
  {
    regex: /https:\/\/www\.amazon\.fr\/gp\/cart\/view\.html/,
    method: amazonParserFR.fromCart,
    parser: amazonParserFR
  },
  {
    regex: /https:\/\/www\.amazon\.fr\/hz\/wishlist\//,
    method: amazonParserFR.fromSharedList,
    parser: amazonParserFR
  },
  {
    regex: /https:\/\/secure\.materiel\.net\/Cart/,
    method: materielNetParser.fromCart,
    parser: materielNetParser
  },
  {
    regex: /https:\/\/www\.materiel\.net\/configurateur-pc-sur-mesure/,
    method: materielNetParser.fromConfigurateur,
    parser: materielNetParser
  },
  {
    regex: /https:\/\/secure\.materiel\.net\/Account\/SavedCartsSection/,
    method: materielNetParser.fromSavedCart,
    parser: materielNetParser
  },
  {
    regex: /https:\/\/www\.topachat\.com\/pages\/mon_panier\.php/,
    method: topAchatParser.fromCart,
    parser: topAchatParser
  },
  {
    regex: /https:\/\/www\.topachat\.com\/pages\/configomatic\.php/,
    method: topAchatParser.fromConfigurateur,
    parser: topAchatParser
  },

  {
    regex: /https:\/\/infomaxparis\.com\/commande/,
    method: infomaxParser.fromCart,
    parser: infomaxParser
  },
  {
    regex: /https:\/\/infomaxparis\.com\/achat-pc-gamer-configuration-fixes/,
    method: infomaxParser.fromConfigurateur,
    parser: infomaxParser
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/Sales\/BasketPage\.aspx/,
    method: ldlcParserV1.fromCart,
    parser: ldlcParserV1
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/configurateur-pc/,
    method: ldlcParserV1.fromConfigurateur,
    parser: ldlcParserV1
  },

  {
    regex: /https:\/\/secure2\.ldlc\.com\/fr-ch\/Cart/,
    method: ldlcParserV2CH.fromCart,
    parser: ldlcParserV2CH
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fr-ch\/configurateur-pc/,
    method: ldlcParserV2CH.fromConfigurateur,
    parser: ldlcParserV2CH
  },
  {
    regex: /https:\/\/secure2\.ldlc\.com\/es-es\/Cart/,
    method: ldlcParserV2ES.fromCart,
    parser: ldlcParserV2ES
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/es-es\/(configurateur-pc|configurador-pc)/,
    method: ldlcParserV2ES.fromConfigurateur,
    parser: ldlcParserV2ES
  },

  {
    regex: /https:\/\/secure2\.ldlc\.com\/fr-lu\/Cart/,
    method: ldlcParserV2LU.fromCart,
    parser: ldlcParserV2LU
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fr-lu\/configurateur-pc/,
    method: ldlcParserV2LU.fromConfigurateur,
    parser: ldlcParserV2LU
  },
  {
    regex: /https:\/\/secure2\.ldlc\.com\/fr-be\/Cart/,
    method: ldlcParserV2BE.fromCart,
    parser: ldlcParserV2BE
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fr-be\/configurateur-pc/,
    method: ldlcParserV2BE.fromConfigurateur,
    parser: ldlcParserV2BE
  }
];
