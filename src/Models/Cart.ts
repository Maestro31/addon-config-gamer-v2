import Article from './Article';
import * as uuid from 'uuid/v4';

interface Cart {
  readonly id: string;
  readonly creationDate: Date;
  owner?: string;
  subjectId?: string;
  articles?: Article[];
  modificationDate?: Date;
  refund?: number;
  refundPercent?: number;
  reseller?: ResellerInfo;
  tags?: string[];
  url?: string;
  priceInfo?: string;
}

namespace Cart {
  export function create(): Cart {
    return {
      id: uuid(),
      creationDate: new Date(),
      refund: 0,
      refundPercent: 0,
      articles: []
    };
  }

  export function getPriceWithRefund(config: Cart) {
    const price = config.articles.reduce(
      (acc, c) => acc + Article.getTotalPrice(c),
      0
    );

    return price - (price * config.refundPercent) / 100 - config.refund;
  }

  export function getPriceWithoutRefund(config: Cart) {
    return config.articles.reduce((acc, c) => acc + c.price, 0);
  }

  export function getTotalRefund(config: Cart) {
    return getPriceWithoutRefund(config) - getPriceWithRefund(config);
  }

  export function isAvailable(config: Cart) {
    return config.articles.every(c => c.available);
  }

  export function getCreationDate(config) {
    return config.creationDate.toLocaleDateString('fr-FR', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
  }
}

export default Cart;
