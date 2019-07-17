import Article from '../../Models/Article';
import Cart from '../../Models/Cart';
import AmazonParser from './AmazonParser';
import InfomaxParser from './InfomaxParser';
import LdlcParserV2 from './LdlcParserV2';
import MaterielNetParser from './MaterielNetParser';
import TopAchatParser from './TopAchatParser';

type Parser =
  | MaterielNetParser
  | TopAchatParser
  | InfomaxParser
  | LdlcParserV2
  | AmazonParser;

interface ParserMatch {
  regex: RegExp;
  parser: Parser;
  method?: Function;
}

export default class ParserService {
  public parsers: Parser[];
  public matches: ParserMatch[];
  public productMatches: ParserMatch[];

  getParserByName(name: string): Parser {
    return this.parsers.find(parser => parser.reseller.name === name);
  }

  parseCart = (): Cart => {
    const url = window.location.href;
    const matchParser = this.matches.find(
      match => !!url.match(match.regex)
    );
    return matchParser.method();
  };

  parseArticle = (url: string): Promise<Article> => {
    const matchParser = this.productMatches.find(
      match => !!url.match(match.regex)
    );

    console.log(this.productMatches)
    return matchParser ? matchParser.parser.fromArticlePage(url) : null;
  };

  updateCart = (config): Promise<Cart> => {
    for (let parser of this.parsers) {
      if (config.reseller.name === parser.reseller.name && parser.updateCart) {
        return parser.updateCart(config);
      }
    }
  };

  searchArticle = (
    resellerName: string,
    keys: SearchArgs
  ): Promise<SearchResponse> => {
    return this.getParserByName(resellerName).searchArticle(keys);
  };
}

/**
 * Liste des parsers pour chaque revendeur
 */

// const materielNetParser = new MaterielNetParser();
// const topAchatParser = new TopAchatParser();
// const infomaxParser = new InfomaxParser();

// const ldlcParserV2FR = new LdlcParserV2(
//   {
//     name: 'LDLC France',
//     url: 'https://www.ldlc.com',
//     currency: 'EUR'
//   },
//   {
//     searchUrlTemplate: ({ text, index, categories }: SearchArgs): string =>
//       `https://www.ldlc.com/search/product/${text}/ftxt-/${index}?department=${
//         categories[0]
//       }`
//   }
// );

// const ldlcParserV2ES = new LdlcParserV2(
//   {
//     name: 'LDLC Espagne',
//     url: 'https://www.ldlc.com/es-es',
//     currency: 'EUR'
//   },
//   {
//     searchUrlTemplate: ({ text, index, categories }: SearchArgs): string =>
//       `https://www.ldlc.com/v4/es-es/search/product/${text}/ftxt-/${index}?department=${
//         categories[0]
//       }`
//   }
// );
// const ldlcParserV2CH = new LdlcParserV2(
//   {
//     name: 'LDLC Suisse',
//     url: 'https://www.ldlc.ch',
//     currency: 'CHF'
//   },
//   {
//     searchUrlTemplate: ({ text, index, categories }: SearchArgs): string =>
//       `https://www.ldlc.com/v4/fr-ch/search/product/${text}/ftxt-/${index}?department=${
//         categories[0]
//       }`
//   }
// );

// const ldlcParserV2LU = new LdlcParserV2(
//   {
//     name: 'LDLC Luxembourg',
//     url: 'https://www.ldlc.com/fr-lu',
//     currency: 'EUR'
//   },
//   {
//     searchUrlTemplate: ({ text, index, categories }: SearchArgs): string =>
//       `https://www.ldlc.com/v4/fr-lu/search/product/${text}/ftxt-/${index}?department=${
//         categories[0]
//       }`
//   }
// );

// const ldlcParserV2BE = new LdlcParserV2(
//   {
//     name: 'LDLC Belgique',
//     url: 'https://www.ldlc.com/fr-be',
//     currency: 'EUR'
//   },
//   {
//     searchUrlTemplate: ({ text, index, categories }: SearchArgs): string =>
//       `https://www.ldlc.com/v4/fr-be/search/product/${text}/ftxt-/${index}?department=${
//         categories[0]
//       }`
//   }
// );

// const amazonParserFR = new AmazonParser(
//   {
//     name: 'Amazon France',
//     url: 'https://www.amazon.fr',
//     currency: 'EUR'
//   },
//   {
//     searchUrlTemplate: () => ''
//   }
// );

// ParserService.parsers = [
//   materielNetParser,
//   topAchatParser,
//   infomaxParser,
//   ldlcParserV2FR,
//   ldlcParserV2BE,
//   ldlcParserV2CH,
//   ldlcParserV2ES,
//   ldlcParserV2LU,
//   amazonParserFR
// ];

// ParserService.productMatches = [
//   {
//     regex: /https:\/\/www\.amazon\.fr\/(.+\/)?[a-z]+\/(product\/)?[A-Z0-9]+/,
//     parser: amazonParserFR
//   },
//   {
//     regex: /https:\/\/www\.materiel\.net\/produit\/[0-9]+\.html/,
//     parser: materielNetParser
//   },
//   {
//     regex: /https:\/\/www\.topachat\.com\/pages\/detail2_cat_est_.+_puis_.+_puis_ref_est_.+\.html/,
//     parser: topAchatParser
//   },
//   {
//     regex: /https:\/\/www\.ldlc\.com\/fiche\/[A-Z0-9]+\.html/,
//     parser: ldlcParserV2FR
//   },
//   {
//     regex: /https:\/\/www\.ldlc\.com\/fr-ch\/fiche\/[A-Z0-9]+\.html/,
//     method: ldlcParserV2CH.fromArticlePage,
//     parser: ldlcParserV2CH
//   },
//   {
//     regex: /https:\/\/www\.ldlc\.com\/fr-be\/fiche\/[A-Z0-9]+\.html/,
//     parser: ldlcParserV2BE
//   },
//   {
//     regex: /https:\/\/www\.ldlc\.com\/fr-lu\/fiche\/[A-Z0-9]+\.html/,
//     parser: ldlcParserV2LU
//   },
//   {
//     regex: /https:\/\/www\.ldlc\.com\/es-es\/fiche\/[A-Z0-9]+\.html/,
//     parser: ldlcParserV2ES
//   },
//   {
//     regex: /https:\/\/infomaxparis.com/,
//     parser: infomaxParser
//   }
// ];

// ParserService.matches = [
//   {
//     regex: /https:\/\/www\.amazon\.fr\/gp\/cart\/view\.html/,
//     method: amazonParserFR.fromCart,
//     parser: amazonParserFR
//   },
//   {
//     regex: /https:\/\/www\.amazon\.fr\/hz\/wishlist\//,
//     method: amazonParserFR.fromSharedList,
//     parser: amazonParserFR
//   },
//   {
//     regex: /https:\/\/secure\.materiel\.net\/Cart/,
//     method: materielNetParser.fromCart,
//     parser: materielNetParser
//   },
//   {
//     regex: /https:\/\/www\.materiel\.net\/configurateur-pc-sur-mesure/,
//     method: materielNetParser.fromConfigurateur,
//     parser: materielNetParser
//   },
//   {
//     regex: /https:\/\/secure\.materiel\.net\/Account\/SavedCartsSection/,
//     method: materielNetParser.fromSavedCart,
//     parser: materielNetParser
//   },
//   {
//     regex: /https:\/\/secure\.materiel\.net\/Cart\/SharedCart/,
//     method: materielNetParser.fromCart,
//     parser: materielNetParser
//   },
//   {
//     regex: /https:\/\/www\.topachat\.com\/pages\/mon_panier\.php/,
//     method: topAchatParser.fromCart,
//     parser: topAchatParser
//   },
//   {
//     regex: /https:\/\/www\.topachat\.com\/pages\/configomatic\.php/,
//     method: topAchatParser.fromConfigurateur,
//     parser: topAchatParser
//   },

//   {
//     regex: /https:\/\/infomaxparis\.com\/commande/,
//     method: infomaxParser.fromCart,
//     parser: infomaxParser
//   },
//   {
//     regex: /https:\/\/infomaxparis\.com\/achat-pc-gamer-configuration-fixes/,
//     method: infomaxParser.fromConfigurateur,
//     parser: infomaxParser
//   },
//   {
//     regex: /https:\/\/www\.ldlc\.com\/Sales\/BasketPage\.aspx/,
//     method: ldlcParserV2FR.fromCart,
//     parser: ldlcParserV2FR
//   },
//   {
//     regex: /https:\/\/www\.ldlc\.com\/configurateur-pc/,
//     method: ldlcParserV2FR.fromConfigurateur,
//     parser: ldlcParserV2FR
//   },

//   {
//     regex: /https:\/\/secure2\.ldlc\.com\/fr-ch\/Cart/,
//     method: ldlcParserV2CH.fromCart,
//     parser: ldlcParserV2CH
//   },
//   {
//     regex: /https:\/\/www\.ldlc\.com\/fr-ch\/configurateur-pc/,
//     method: ldlcParserV2CH.fromConfigurateur,
//     parser: ldlcParserV2CH
//   },
//   {
//     regex: /https:\/\/secure2\.ldlc\.com\/es-es\/Cart/,
//     method: ldlcParserV2ES.fromCart,
//     parser: ldlcParserV2ES
//   },
//   {
//     regex: /https:\/\/www\.ldlc\.com\/es-es\/(configurateur-pc|configurador-pc)/,
//     method: ldlcParserV2ES.fromConfigurateur,
//     parser: ldlcParserV2ES
//   },

//   {
//     regex: /https:\/\/secure2\.ldlc\.com\/fr-lu\/Cart/,
//     method: ldlcParserV2LU.fromCart,
//     parser: ldlcParserV2LU
//   },
//   {
//     regex: /https:\/\/www\.ldlc\.com\/fr-lu\/configurateur-pc/,
//     method: ldlcParserV2LU.fromConfigurateur,
//     parser: ldlcParserV2LU
//   },
//   {
//     regex: /https:\/\/secure2\.ldlc\.com\/fr-be\/Cart/,
//     method: ldlcParserV2BE.fromCart,
//     parser: ldlcParserV2BE
//   },
//   {
//     regex: /https:\/\/www\.ldlc\.com\/fr-be\/configurateur-pc/,
//     method: ldlcParserV2BE.fromConfigurateur,
//     parser: ldlcParserV2BE
//   }
// ];
