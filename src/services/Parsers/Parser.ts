import MaterielNetParser from './MaterielNetParser';
import TopAchatParser from './TopAchatParser';
import LdlcParserV1 from './LdlcParserV1';
import LdlcParserV2 from './LdlcParserV2';
import InfomaxParser from './InfomaxParser';
import Config, { ComparisonResult } from '../../Models/Config';

type ResellerParser =
  | MaterielNetParser
  | TopAchatParser
  | InfomaxParser
  | LdlcParserV1
  | LdlcParserV2;

export default class Parser {
  static parsers: ResellerParser[];

  static getParserByName(name: string): ResellerParser {
    for (let parser of Parser.parsers) {
      if (parser.reseller.name == name) {
        return parser;
      }
    }
  }

  static parseConfig = (): Config => {
    let config = new Config();
    const url = window.location.href;
    for (let parser of Parser.parsers) {
      for (let matchUrl of parser.config.matchesUrl) {
        if (url.match(matchUrl.regex)) {
          config = parser[matchUrl.methodName]();
          config.currency = parser.reseller.currency;
          config.reseller = parser.reseller;

          console.log(config);
          return config;
        }
      }
    }
  };

  static updateConfig = (config): Promise<Config> => {
    for (let parser of Parser.parsers) {
      if (
        config.reseller.name === parser.reseller.name &&
        parser.updateConfig
      ) {
        return parser.updateConfig(config);
      }
    }
  };

  static searchComponent = (
    resellerName: string,
    keys: SearchArgs
  ): Promise<SearchResponse> => {
    return Parser.getParserByName(resellerName).searchComponent(keys);
  };
}
/**
 * Liste des parsers pour chaque revendeur
 */

Parser.parsers = [
  new MaterielNetParser(),
  new TopAchatParser(),
  new InfomaxParser(),
  new LdlcParserV1(),
  new LdlcParserV2(
    {
      name: 'LDLC Suisse',
      url: 'https://www.ldlc.ch',
      currency: 'CHF'
    },
    {
      searchUrlTemplate: ({ text, index, categories }: SearchArgs): string =>
        `https://www.ldlc.com/v4/fr-ch/search/product/${text}/ftxt-/${index}?department=${
          categories[0]
        }`,
      matchesUrl: [
        {
          regex: /https:\/\/secure2\.ldlc\.com\/fr-ch\/Cart/,
          methodName: 'fromCart'
        },
        {
          regex: /https:\/\/www\.ldlc\.com\/fr-ch\/configurateur-pc/,
          methodName: 'fromConfigurateur'
        }
      ]
    }
  ),
  new LdlcParserV2(
    {
      name: 'LDLC Espagne',
      url: 'https://www.ldlc.com/es-es',
      currency: 'EUR'
    },
    {
      searchUrlTemplate: ({ text, index, categories }: SearchArgs): string =>
        `https://www.ldlc.com/v4/es-es/search/product/${text}/ftxt-/${index}?department=${
          categories[0]
        }`,
      matchesUrl: [
        {
          regex: /https:\/\/secure2\.ldlc\.com\/es-es\/Cart/,
          methodName: 'fromCart'
        },
        {
          regex: /https:\/\/www\.ldlc\.com\/es-es\/(configurateur-pc|configurador-pc)/,
          methodName: 'fromConfigurateur'
        }
      ]
    }
  ),
  new LdlcParserV2(
    {
      name: 'LDLC Luxembourg',
      url: 'https://www.ldlc.com/fr-lu',
      currency: 'EUR'
    },
    {
      searchUrlTemplate: ({ text, index, categories }: SearchArgs): string =>
        `https://www.ldlc.com/v4/fr-lu/search/product/${text}/ftxt-/${index}?department=${
          categories[0]
        }`,
      matchesUrl: [
        {
          regex: /https:\/\/secure2\.ldlc\.com\/fr-lu\/Cart/,
          methodName: 'fromCart'
        },
        {
          regex: /https:\/\/www\.ldlc\.com\/fr-lu\/configurateur-pc/,
          methodName: 'fromConfigurateur'
        }
      ]
    }
  ),
  new LdlcParserV2(
    {
      name: 'LDLC Belgique',
      url: 'https://www.ldlc.com/fr-be',
      currency: 'EUR'
    },
    {
      searchUrlTemplate: ({ text, index, categories }: SearchArgs): string =>
        `https://www.ldlc.com/v4/fr-be/search/product/${text}/ftxt-/${index}?department=${
          categories[0]
        }`,
      matchesUrl: [
        {
          regex: /https:\/\/secure2\.ldlc\.com\/fr-be\/Cart/,
          methodName: 'fromCart'
        },
        {
          regex: /https:\/\/www\.ldlc\.com\/fr-be\/configurateur-pc/,
          methodName: 'fromConfigurateur'
        }
      ]
    }
  )
];
