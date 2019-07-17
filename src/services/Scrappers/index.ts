import Scrapper from './Scrapper'
import AmazonScrapper from './AmazonScrapper';
import InfomaxScrapper from './InfomaxScrapper';
import LdlcScrapperV2 from './LdlcScrapperV2';
import MaterielNetScrapper from './MaterielNetScrapper';
import TopAchatScrapper from './TopAchatScrapper';
import Http from '../Adapters/Http'

const materielNetScrapper = new MaterielNetScrapper(new Http());
const topAchatScrapper = new TopAchatScrapper(new Http());
const infomaxScrapper = new InfomaxScrapper(new Http());

const ldlcScrapperV2FR = new LdlcScrapperV2(
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
  },
  new Http()
);

const ldlcScrapperV2ES = new LdlcScrapperV2(
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
  },
  new Http()
);
const ldlcScrapperV2CH = new LdlcScrapperV2(
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
  },
  new Http()
);

const ldlcScrapperV2LU = new LdlcScrapperV2(
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
  },
  new Http()
);

const ldlcScrapperV2BE = new LdlcScrapperV2(
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
  },
  new Http()
);

const amazonScrapperFR = new AmazonScrapper(
  {
    name: 'Amazon France',
    url: 'https://www.amazon.fr',
    currency: 'EUR'
  },
  {
    searchUrlTemplate: () => ''
  },
  new Http()
);

const scrapper = new Scrapper()

scrapper.scrappers = [
  materielNetScrapper,
  topAchatScrapper,
  infomaxScrapper,
  ldlcScrapperV2FR,
  ldlcScrapperV2BE,
  ldlcScrapperV2CH,
  ldlcScrapperV2ES,
  ldlcScrapperV2LU,
  amazonScrapperFR
];

scrapper.productMatches = [
  {
    regex: /https:\/\/www\.amazon\.fr\/(.+\/)?[a-z]+\/(product\/)?[A-Z0-9]+/,
    scrapper: amazonScrapperFR
  },
  {
    regex: /https:\/\/www\.materiel\.net\/produit\/[0-9]+\.html/,
    scrapper: materielNetScrapper
  },
  {
    regex: /https:\/\/www\.topachat\.com\/pages\/detail2_cat_est_.+_puis_.+_puis_ref_est_.+\.html/,
    scrapper: topAchatScrapper
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fiche\/[A-Z0-9]+\.html/,
    scrapper: ldlcScrapperV2FR
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fr-ch\/fiche\/[A-Z0-9]+\.html/,
    method: ldlcScrapperV2CH.fromArticlePage,
    scrapper: ldlcScrapperV2CH
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fr-be\/fiche\/[A-Z0-9]+\.html/,
    scrapper: ldlcScrapperV2BE
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fr-lu\/fiche\/[A-Z0-9]+\.html/,
    scrapper: ldlcScrapperV2LU
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/es-es\/fiche\/[A-Z0-9]+\.html/,
    scrapper: ldlcScrapperV2ES
  },
  {
    regex: /https:\/\/infomaxparis.com/,
    scrapper: infomaxScrapper
  }
];

scrapper.matches = [
  {
    regex: /https:\/\/www\.amazon\.fr\/gp\/cart\/view\.html/,
    method: amazonScrapperFR.fromCart,
    scrapper: amazonScrapperFR
  },
  {
    regex: /https:\/\/www\.amazon\.fr\/hz\/wishlist\//,
    method: amazonScrapperFR.fromSharedList,
    scrapper: amazonScrapperFR
  },
  {
    regex: /https:\/\/secure\.materiel\.net\/Cart/,
    method: materielNetScrapper.fromCart,
    scrapper: materielNetScrapper
  },
  {
    regex: /https:\/\/www\.materiel\.net\/configurateur-pc-sur-mesure/,
    method: materielNetScrapper.fromConfigurateur,
    scrapper: materielNetScrapper
  },
  {
    regex: /https:\/\/secure\.materiel\.net\/Account\/SavedCartsSection/,
    method: materielNetScrapper.fromSavedCart,
    scrapper: materielNetScrapper
  },
  {
    regex: /https:\/\/secure\.materiel\.net\/Cart\/SharedCart/,
    method: materielNetScrapper.fromCart,
    scrapper: materielNetScrapper
  },
  {
    regex: /https:\/\/www\.topachat\.com\/pages\/mon_panier\.php/,
    method: topAchatScrapper.fromCart,
    scrapper: topAchatScrapper
  },
  {
    regex: /https:\/\/www\.topachat\.com\/pages\/configomatic\.php/,
    method: topAchatScrapper.fromConfigurateur,
    scrapper: topAchatScrapper
  },

  {
    regex: /https:\/\/infomaxparis\.com\/commande/,
    method: infomaxScrapper.fromCart,
    scrapper: infomaxScrapper
  },
  {
    regex: /https:\/\/infomaxparis\.com\/achat-pc-gamer-configuration-fixes/,
    method: infomaxScrapper.fromConfigurateur,
    scrapper: infomaxScrapper
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/Sales\/BasketPage\.aspx/,
    method: ldlcScrapperV2FR.fromCart,
    scrapper: ldlcScrapperV2FR
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/configurateur-pc/,
    method: ldlcScrapperV2FR.fromConfigurateur,
    scrapper: ldlcScrapperV2FR
  },

  {
    regex: /https:\/\/secure2\.ldlc\.com\/fr-ch\/Cart/,
    method: ldlcScrapperV2CH.fromCart,
    scrapper: ldlcScrapperV2CH
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fr-ch\/configurateur-pc/,
    method: ldlcScrapperV2CH.fromConfigurateur,
    scrapper: ldlcScrapperV2CH
  },
  {
    regex: /https:\/\/secure2\.ldlc\.com\/es-es\/Cart/,
    method: ldlcScrapperV2ES.fromCart,
    scrapper: ldlcScrapperV2ES
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/es-es\/(configurateur-pc|configurador-pc)/,
    method: ldlcScrapperV2ES.fromConfigurateur,
    scrapper: ldlcScrapperV2ES
  },

  {
    regex: /https:\/\/secure2\.ldlc\.com\/fr-lu\/Cart/,
    method: ldlcScrapperV2LU.fromCart,
    scrapper: ldlcScrapperV2LU
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fr-lu\/configurateur-pc/,
    method: ldlcScrapperV2LU.fromConfigurateur,
    scrapper: ldlcScrapperV2LU
  },
  {
    regex: /https:\/\/secure2\.ldlc\.com\/fr-be\/Cart/,
    method: ldlcScrapperV2BE.fromCart,
    scrapper: ldlcScrapperV2BE
  },
  {
    regex: /https:\/\/www\.ldlc\.com\/fr-be\/configurateur-pc/,
    method: ldlcScrapperV2BE.fromConfigurateur,
    scrapper: ldlcScrapperV2BE
  }
];

export default scrapper