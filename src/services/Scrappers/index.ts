import Scrapper from './Scrapper'
import AmazonScrapper from './AmazonScrapper';
import LdlcScrapper from './LdlcScrapper';
import MaterielNetScrapper from './MaterielNetScrapper';
import TopAchatScrapper from './TopAchatScrapper';

const materielNet = new MaterielNetScrapper();
const topAchat = new TopAchatScrapper();

const ldlcFR = new LdlcScrapper(
  {
    name: 'LDLC France',
    url: 'https://www.ldlc.com',
    currency: 'EUR'
  },
  {
    searchUrlTemplate: ({ text, index, categories }: SearchArgs): string =>
      `https://www.ldlc.com/search/product/${text}/ftxt-/${index}?department=${
      categories[0]
      }`
  }
);

const ldlcES = new LdlcScrapper(
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
const ldlcCH = new LdlcScrapper(
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

const ldlcLU = new LdlcScrapper(
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

const ldlcBE = new LdlcScrapper(
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

const amazon = new AmazonScrapper();

const scrapper = new Scrapper()

scrapper.scrappers = [
  materielNet,
  topAchat,
  ldlcFR,
  ldlcBE,
  ldlcCH,
  ldlcES,
  ldlcLU,
  amazon
];

scrapper.productMatches = [
  {
    regex: /https:\/\/www\.amazon\.fr\/(.+\/)?[a-z]+\/(product\/)?[A-Z0-9]+/,
    scrapper: amazon
  },
  {
    regex: /https:\/\/www\.materiel\.net\/produit\/[0-9]+\.html/,
    scrapper: materielNet
  },
  {
    regex: /https:\/\/www\.topachat\.com\/pages\/detail2_cat_est_.+_puis_.+_puis_ref_est_.+\.html/,
    scrapper: topAchat
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fiche\/[A-Z0-9]+\.html/,
    scrapper: ldlcFR
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fr-ch\/fiche\/[A-Z0-9]+\.html/,
    method: ldlcCH.fromArticlePage,
    scrapper: ldlcCH
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fr-be\/fiche\/[A-Z0-9]+\.html/,
    scrapper: ldlcBE
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fr-lu\/fiche\/[A-Z0-9]+\.html/,
    scrapper: ldlcLU
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/es-es\/fiche\/[A-Z0-9]+\.html/,
    scrapper: ldlcES
  }
];

scrapper.matches = [
  {
    regex: /https:\/\/www\.amazon\.fr\/gp\/cart\/view\.html/,
    method: amazon.fromCart,
    scrapper: amazon
  },
  {
    regex: /https:\/\/www\.amazon\.fr\/hz\/wishlist\//,
    method: amazon.fromSharedList,
    scrapper: amazon
  },
  {
    regex: /https:\/\/secure\.materiel\.net\/Cart/,
    method: materielNet.fromCart,
    scrapper: materielNet
  },
  {
    regex: /https:\/\/www\.materiel\.net\/configurateur-pc-sur-mesure/,
    method: materielNet.fromConfigurateur,
    scrapper: materielNet
  },
  {
    regex: /https:\/\/secure\.materiel\.net\/Account\/SavedCartsSection/,
    method: materielNet.fromSavedCart,
    scrapper: materielNet
  },
  {
    regex: /https:\/\/secure\.materiel\.net\/Cart\/SharedCart/,
    method: materielNet.fromCart,
    scrapper: materielNet
  },
  {
    regex: /https:\/\/www\.topachat\.com\/pages\/mon_panier\.php/,
    method: topAchat.fromCart,
    scrapper: topAchat
  },
  {
    regex: /https:\/\/www\.topachat\.com\/pages\/configomatic\.php/,
    method: topAchat.fromConfigurateur,
    scrapper: topAchat
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/Sales\/BasketPage\.aspx/,
    method: ldlcFR.fromCart,
    scrapper: ldlcFR
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/configurateur-pc/,
    method: ldlcFR.fromConfigurateur,
    scrapper: ldlcFR
  },

  {
    regex: /https:\/\/secure2\.ldlc\.com\/fr-ch\/Cart/,
    method: ldlcCH.fromCart,
    scrapper: ldlcCH
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fr-ch\/configurateur-pc/,
    method: ldlcCH.fromConfigurateur,
    scrapper: ldlcCH
  },
  {
    regex: /https:\/\/secure2\.ldlc\.com\/es-es\/Cart/,
    method: ldlcES.fromCart,
    scrapper: ldlcES
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/es-es\/(configurateur-pc|configurador-pc)/,
    method: ldlcES.fromConfigurateur,
    scrapper: ldlcES
  },

  {
    regex: /https:\/\/secure2\.ldlc\.com\/fr-lu\/Cart/,
    method: ldlcLU.fromCart,
    scrapper: ldlcLU
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fr-lu\/configurateur-pc/,
    method: ldlcLU.fromConfigurateur,
    scrapper: ldlcLU
  },
  {
    regex: /https:\/\/secure2\.ldlc\.com\/fr-be\/Cart/,
    method: ldlcBE.fromCart,
    scrapper: ldlcBE
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fr-be\/configurateur-pc/,
    method: ldlcBE.fromConfigurateur,
    scrapper: ldlcBE
  }
];

export default scrapper