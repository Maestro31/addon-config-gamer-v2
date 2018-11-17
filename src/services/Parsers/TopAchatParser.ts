import axios from 'axios';
import Cart from '../../Models/Cart';
import Article from '../../Models/Article';
import AbstractParser from './AbstractParser';

export default class TopAchatParser extends AbstractParser {
  priceInfo =
    '*Panier éligible à 5% de réduction sur demande en MP sur FB ou Twitter à Top Achat';

  reseller: ResellerInfo = {
    name: 'Top Achat',
    url: 'https://www.topachat.com',
    currency: 'EUR',
    tag: '#ae51'
  };

  config: ParserParams = {
    searchUrlTemplate: ({ text, categories }: SearchArgs): string =>
      `https://www.topachat.com/pages/produits_cat_est_${categories[0]}${
        categories[1] ? `_puis_rubrique_est_${categories[1]}` : ''
      }${text ? `_puis_mc_est_${text}.html` : ''}`,
    searchUrlByCategoryTemplate: (categories: string[]): string =>
      `https://www.topachat.com/pages/produits_cat_est_${categories[0]}${
        categories[1] ? `_puis_rubrique_est_${categories[1]}` : ''
      }`,
    categoryList: [
      {
        label: 'Processeur',
        options: [
          {
            label: 'Processeur',
            value: 'micro/wpr'
          }
        ]
      },
      {
        label: 'Carte mère',
        options: [
          {
            label: 'CM Socket 1151',
            value: 'micro/w_cm_1151'
          },
          {
            label: 'CM Socket 2066',
            value: 'micro/w_cm_2066'
          },
          {
            label: 'CM Socket AM4',
            value: 'micro/w_cm_am4'
          },
          {
            label: 'CM Socket TR4',
            value: 'micro/w_cm_tr4'
          },
          {
            label: 'CM Raspberry',
            value: 'micro/w_raps'
          },
          {
            label: 'CM Autres Sockets',
            value: 'micro/w_cm_div'
          }
        ]
      },
      {
        label: 'Refroidissement',
        options: [
          {
            label: 'Watercooling',
            value: 'micro/w_reliq'
          },
          {
            label: 'Ventirad pour processeur',
            value: 'micro/w_ven'
          },
          {
            label: 'Ventilateurs 92 / 120 mm et plus',
            value: 'micro/w_tu_ven'
          },
          {
            label: 'Refroidissement carte graphique',
            value: 'micro/w_cartgra'
          },
          {
            label: 'Pâte thermique',
            value: 'micro/w_path'
          },
          {
            label: 'Refroidissement divers',
            value: 'micro/w_refroi'
          }
        ]
      },
      {
        label: 'Mémoire RAM',
        options: [
          {
            label: 'RAM DDR4',
            value: 'micro/wme_ddr4'
          },
          {
            label: 'RAM DDR4',
            value: 'micro/wme_ddr3'
          },
          {
            label: 'RAM Anciennes mémoires',
            value: 'micro/w_oldme'
          },
          {
            label: 'RAM SO-DIMM pour PC Portable',
            value: 'micro/wme_ddr3'
          }
        ]
      },
      {
        label: 'Carte graphique',
        options: [
          {
            label: 'Carte graphique',
            value: 'micro/wgfx_pcie'
          }
        ]
      },
      {
        label: 'Boîtier PC',
        options: [
          {
            label: 'Boîtier PC',
            value: 'micro/w_boi_sa'
          }
        ]
      },
      {
        label: 'Alimentation PC',
        options: [
          {
            label: 'Alimentation',
            value: 'micro/w_ali'
          },
          {
            label: 'Accessoires alimentation PC',
            value: 'micro/w_accboi'
          }
        ]
      },
      {
        label: 'Lecteurs',
        options: [
          {
            label: 'Graveur',
            value: 'micro/w_grav'
          },
          {
            label: 'Lecteur de cartes',
            value: 'micro/w_lec'
          }
        ]
      },
      {
        label: 'Cartes PCI autres',
        options: [
          {
            label: 'Carte contrôleur',
            value: 'micro/w_con'
          },
          {
            label: 'Carte Son',
            value: 'micro/w_son'
          },
          {
            label: 'Carte Wifi',
            value: 'reseau/wt_wcpi'
          },
          {
            label: 'Carte Réseau',
            value: 'reseau/wt_car'
          }
        ]
      },
      {
        label: "Kit d'évolution",
        value: 'micro/w_kitevo'
      },
      {
        label: 'Stockage',
        options: [
          {
            label: 'SSD',
            value: 'micro/w_ssd'
          },
          {
            label: 'Disque dur 3.5" SATA',
            value: 'micro/wdi_sata'
          },
          {
            label: 'Disque dur 2.5" SATA (pour portable)',
            value: 'micro/wdi_port'
          },
          {
            label: 'Nappe & cable rond',
            value: 'micro/w_cb_ide'
          },
          {
            label: 'Accessoires disque dur',
            value: 'micro/wdi_acc'
          },
          {
            label: 'Disque dur externe',
            value: 'micro/w_dde'
          },
          {
            label: 'Boîtiers & docks pour disque dur',
            value: 'micro/boitier-disque-dur'
          },
          {
            label: 'Clés USB',
            value: 'micro/w_musb'
          },
          {
            label: 'Cartes Mémoires',
            value: 'micro/w_mem'
          },
          {
            label: 'Docks HDD',
            value: 'micro/w_docks'
          }
        ]
      },
      {
        label: 'Autres Accessoires',
        options: [
          {
            label: 'Modding PC',
            value: 'micro/tunning-pc'
          },
          {
            label: 'Rhéobus',
            value: 'micro/w_pancont'
          }
        ]
      },
      {
        label: 'Connectique informatique',
        options: [
          {
            label: 'Nappe & câble rond',
            value: 'micro/w_cb_ide'
          },
          {
            label: 'Câble vidéo informatique',
            value: 'peripheriques/w_cvi'
          },
          {
            label: 'Câble intégration',
            value: 'micro/w_accboi'
          },
          {
            label: 'Connectique réseau',
            value: 'reseau/wt_cab'
          },
          {
            label: 'Câble USB',
            value: 'peripheriques/w_cb_usb'
          },
          {
            label: 'Hub USB',
            value: 'peripheriques/w_hub_usb'
          },
          {
            label: 'Commutateur KVM',
            value: 'peripheriques/w_res_comm'
          },
          {
            label: 'Câbles et adaptateurs divers',
            value: 'micro/w_cb_div'
          }
        ]
      },
      {
        label: 'Périphériques',
        value: 'peripheriques',
        options: [
          {
            label: 'Ecran PC',
            value: 'peripheriques/w_moni'
          }
        ]
      }
    ]
  };

  fromCart(): Cart {
    let cart = Cart.create();
    cart.reseller = this.reseller;

    const elements = this.getAllElements(document.body, '#recap tbody > tr');

    Array.prototype.forEach.call(elements, parentNode => {
      let article = Article.create();
      article.reseller = this.reseller;

      article.imageUrl = this.getElementAttribute(parentNode, {
        selector: 'img',
        attribute: 'src',
        defaultValue: '#'
      });
      article.name = this.getElementAttribute(parentNode, {
        selector: '.unstyled',
        attribute: 'innerText',
        onlyRootText: true,
        defaultValue: ''
      });
      article.url =
        this.getElementAttribute(parentNode, {
          selector: '.unstyled',
          attribute: 'href',
          defaultValue: '#'
        }) + this.reseller.tag;
      let price = this.getElementAttribute(parentNode, {
        selector: 'td:nth-child(3)',
        attribute: 'innerText',
        defaultValue: '0'
      });

      article.price = parseFloat(price.replace('€', '').replace(/\s/g, ''));
      article.quantity = this.getElementAttribute(parentNode, {
        selector: '.currQt',
        attribute: 'innerText',
        defaultValue: 1
      });

      article.available =
        this.getElementAttribute(parentNode, {
          selector: '.en-stock',
          attribute: 'innerText',
          defaultValue: ''
        }) !== '';

      cart.articles.push(article);
    });

    const price = Cart.getCartPriceWithoutRefund(cart);

    if (price >= 1000) {
      cart.refundPercent = 5;
      cart.priceInfo = this.priceInfo;
    }

    return cart;
  }

  fromConfigurateur = (): Cart => {
    let cart = Cart.create();
    cart.reseller = this.reseller;

    let elements = this.getAllElements(document.body, '.hasProduct');

    Array.prototype.forEach.call(elements, parentNode => {
      let article = Article.create();
      article.reseller = this.reseller;

      article.imageUrl = this.getElementAttribute(parentNode, {
        selector: '.configomatic-product__image > img',
        attribute: 'src',
        defaultValue: '#'
      });

      article.name = this.getElementAttribute(parentNode, {
        selector: '.configomatic__product-label',
        attribute: 'innerText',
        defaultValue: ''
      });

      article.url =
        this.getElementAttribute(parentNode, {
          selector: '.configomatic-product__actions > a',
          attribute: 'href',
          defaultValue: '#'
        }) + this.reseller.tag;

      article.price = parseFloat(
        this.getElementAttribute(parentNode, {
          selector: '.configomatic-product__price',
          attribute: 'innerText',
          defaultValue: '0'
        }).replace(/\s/g, '')
      );

      article.available =
        this.getElementAttribute(parentNode, {
          selector: '.cfgo-availability',
          attribute: 'innerText',
          defaultValue: ''
        }) === 'En stock';

      cart.articles.push(article);
    });

    const price = Cart.getCartPriceWithoutRefund(cart);

    if (price >= 1000) {
      cart.refundPercent = 5;
      cart.priceInfo = this.priceInfo;
    }

    return cart;
  };

  fromArticlePage = async (url: string): Promise<Article> => {
    return axios
      .get(url)
      .then(({ data }) => {
        let article = Article.create();
        article.reseller = this.reseller;

        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');

        const price = this.getElementAttribute(doc.body, {
          selector: '#panier .priceFinal',
          attribute: 'innerText',
          defaultValue: '0'
        }).replace(/(\s|€|\*)/g, '');

        article.price = parseFloat(price);
        article.available =
          this.getElementAttribute(doc.body, {
            selector: '#panier.en-stock',
            attribute: 'innerText',
            defaultValue: false
          }) !== '';

        article.imageUrl =
          this.getElementAttribute(doc.body, {
            selector: '.images > figure  img',
            attribute: 'src',
            defaultValue: '#'
          }) + this.reseller.tag;

        article.name = this.getElementAttribute(doc.body, {
          selector: '.libelle > h1',
          attribute: 'innerText',
          defaultValue: ''
        });

        article.url = url + this.reseller.tag;

        return article;
      })
      .catch(error => {
        console.error(error.message);
        return null;
      });
  };

  updateArticle = async (article: Article): Promise<Article> => {
    return axios.get(article.url).then(({ data }) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');

      const price = this.getElementAttribute(doc.body, {
        selector: '#panier .priceFinal',
        attribute: 'innerText',
        defaultValue: '0'
      })
        .replace('€', '.')
        .replace(' ', '');

      article.price = parseFloat(price);
      article.available =
        this.getElementAttribute(doc.body, {
          selector: '#panier.en-stock',
          attribute: 'innerText',
          defaultValue: false
        }) !== '';

      return article;
    });
  };

  parseListComponents = (doc: Document): Article[] => {
    let articles: Array<Article> = [];

    const elements = this.getAllElements(
      doc.body,
      '.produits .grille-produit > section'
    );

    Array.prototype.forEach.call(elements, parentNode => {
      let article = Article.create();
      article.reseller = this.reseller;

      const id = parentNode.id;

      article.imageUrl = `${this.reseller.url}/boutique/img/${id.substr(
        0,
        2
      )}/${id.substr(0, 6)}/${id}/${id}01.jpg`;

      article.name = this.getElementAttribute(parentNode, {
        selector: '.libelle h3 ',
        attribute: 'innerText',
        defaultValue: ''
      });

      let url =
        this.getElementAttribute(parentNode, {
          selector: '.libelle > a',
          attribute: 'href',
          defaultValue: '#'
        }) + this.reseller.tag;

      url = url.replace(/^https?:\/\/[a-zA-Z\.:0-9]+/g, '');

      article.url = `${this.reseller.url}${url}`;

      const classList = parentNode.classList;
      article.available =
        classList.contains('en-stock') || classList.contains('en-stock-limite');

      const price = this.getElementAttribute(parentNode, {
        selector: '.price .prod_px_euro',
        attribute: 'innerText',
        defaultValue: '0'
      });

      article.price = parseFloat(price.replace(/(\s|€|\*)/g, ''));

      articles.push(article);
    });

    return articles;
  };

  async searchArticle(keys: SearchArgs): Promise<SearchResponse> {
    if (keys.text === undefined || keys.text === '') {
      return this.searchComponentWithFilter(keys);
    }

    const url = this.config.searchUrlTemplate(keys);

    return axios
      .get(url)
      .then(({ data }) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');

        const itemsCountString = this.getElementAttribute(doc.body, {
          selector: 'nav.ariane.top > ul > li.current',
          attribute: 'innerText',
          defaultValue: ''
        });

        const match = itemsCountString.match(/\(([0-9])+/g);

        if (!match) return this.sendNoArticleFound('Aucun élément trouvé');

        const articlesCount = parseInt(match[0].replace('(', ''));
        const pageCount = 1;
        const components = this.parseListComponents(doc);

        return {
          pageCount,
          currentPage: keys.index,
          articlesCount,
          articles: components
        };
      })
      .catch(error => {
        console.error(error);
        return {
          pageCount: 0,
          currentPage: 0,
          articlesCount: 0,
          articles: [],
          error
        };
      });
  }

  getFilters(doc: Document): FilterData[] {
    const filterNodes = this.getAllElements(doc.body, '#filtres .filter-box');

    let filters: FilterData[] = [];

    Array.prototype.forEach.call(filterNodes, filterNode => {
      let filter: FilterData = {
        id: '',
        type: '',
        label: '',
        options: []
      };

      filter.id = this.getElementAttribute(filterNode, {
        selector: '.bloc-filter',
        attribute: 'id',
        defaultValue: ''
      });

      filter.type = this.getElementAttribute(filterNode, {
        selector: '.bloc-filter',
        innerAttribute: 'data-type-filter',
        defaultValue: ''
      });

      filter.label = this.getElementAttribute(filterNode, {
        selector: 'label',
        attribute: 'innerText',
        defaultValue: ''
      });

      filter.options = [];
      if (filter.type === 'combo') {
        const inputs = this.getAllElements(filterNode, 'input');

        Array.prototype.forEach.call(inputs, inputNode => {
          filter.options.push({
            label: inputNode.nextSibling.nodeValue,
            value: inputNode.value,
            selected: false
          });
        });
      }

      if (filter.type === 'ruler') {
        const steps = JSON.parse(
          this.getElementAttribute(filterNode, {
            selector: '.ruler',
            innerAttribute: 'data-steps',
            defaultValue: ''
          })
        );

        Object.values(steps).forEach((step: any) => {
          if (typeof step !== 'number') {
            filter.options.push({
              label: step.label,
              value: step.val,
              selected: false
            });
          }
        });
      }

      filters.push(filter);
    });
    return filters;
  }

  getSearchWithFilterUrl(args: SearchArgs): string {
    let url = this.config.searchUrlByCategoryTemplate(args.categories);

    if (args.filterValues && args.filterValues.length !== 0) {
      let selectedOptions = {};
      let filterValues = args.filterValues;

      for (let i = 0; i < filterValues.length; i++) {
        const id = filterValues[i].id;
        const value = filterValues[i].value;
        if (selectedOptions[id] === undefined) {
          selectedOptions[id] = [];
        }

        selectedOptions[id].push(value.toString());
      }

      url += '_puis_f_est_';
      Object.keys(selectedOptions).forEach(key => {
        if (selectedOptions[key][0].includes('_'))
          url += `${key}-${selectedOptions[key][0]}|`;
        else url += `${key}-${selectedOptions[key].join(',')}|`;
      });

      url = url.substr(0, url.length - 1) + '.html';
    } else url += '.html';

    return url;
  }

  searchComponentWithFilter = async (
    args: SearchArgs
  ): Promise<SearchResponse> => {
    const url = this.getSearchWithFilterUrl(args);

    return axios
      .get(url)
      .then(({ data }) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');

        const pagesEl = this.getAllElements(doc.body, '.pagination > *');

        let maxPage = 1;
        Array.prototype.forEach.call(pagesEl, pageNode => {
          const pageStr = pageNode.innerText.replace(/\./g, '');
          const match = pageStr.match(/[0-9]+/g);
          if (match) {
            maxPage = maxPage < parseInt(pageStr) ? parseInt(pageStr) : maxPage;
          }
        });

        const pageCount = maxPage;

        const articles = this.parseListComponents(doc);

        const errorMessage = this.getElementAttribute(doc.body, {
          selector: '#filtres > div:first-child',
          attribute: 'innerText',
          defaultValue: null
        });

        let result: SearchResponse = {
          pageCount,
          currentPage: args.index,
          articles
        };

        let filters = this.getFilters(doc);

        if (args.filterValues.length > 0) {
          let filterValues = args.filterValues;

          let selectedOptions = {};

          for (let i = 0; i < filterValues.length; i++) {
            const id = filterValues[i].id;
            const value = filterValues[i].value;
            if (selectedOptions[id] === undefined) {
              selectedOptions[id] = [];
            }

            selectedOptions[id].push(value.toString().split('_'));
          }

          const selectedId = Object.keys(selectedOptions);
          let newFilters = [];
          filters.forEach(filter => {
            let newFilter = filter;
            if (selectedId.includes(filter.id)) {
              selectedOptions[filter.id].forEach(selectedOption => {
                newFilter.options = newFilter.options.map(option => {
                  if (selectedOption.includes(option.value.toString()))
                    option.selected = true;
                  return option;
                });
              });
            }
            newFilters.push(filter);
          });

          filters = newFilters;
        }

        console.log({ filters });

        result.filters = filters;

        if (errorMessage.includes('Il n’y a aucun article')) {
          result.error = errorMessage;
        }

        return result;
      })
      .catch(error => {
        console.error(error.message);
        return {
          pageCount: 0,
          currentPage: 0,
          articlesCount: 0,
          error: error.message,
          filters: [],
          articles: []
        };
      });
  };
}
