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

  // export function applyRefundPercentByResellerName(
  //   cart: Cart,
  //   resellerName: string,
  //   refundPercent: number
  // ) {
  //   cart.articles = cart.articles.map(article => {
  //     if (article.reseller.name === resellerName)
  //       article.refundPercent = refundPercent;
  //     return article;
  //   });
  // }

  // export function applyRefund(cart: Cart) {
  //   const topAchatTotalPrice = getArticlesByResellerName(
  //     cart,
  //     'Top Achat'
  //   ).reduce((acc, article) => acc + article.price, 0);

  //   if (topAchatTotalPrice > 1000) {
  //     Cart.applyRefundPercentByResellerName(cart, 'Top Achat', 5);
  //   } else {
  //     Cart.applyRefundPercentByResellerName(cart, 'Top Achat', 0);
  //   }

  //   return cart;
  // }

  // export function getArticlesByResellerName(cart: Cart, resellerName: string) {
  //   return cart.articles.filter(
  //     article => article.reseller.name === resellerName
  //   );
  // }

  export function getTotalRefund(carts: Cart[]) {
    return getTotalPriceWithoutRefund(carts) - getTotalPriceWithRefund(carts);
  }

  export function getTotalPriceWithRefund(carts: Cart[]) {
    return carts.reduce((acc, cart) => acc + getCartPriceWithRefund(cart), 0);
  }

  export function getTotalPriceWithoutRefund(carts: Cart[]) {
    return carts.reduce(
      (acc, cart) => acc + getCartPriceWithoutRefund(cart),
      0
    );
  }

  export function getCartPriceWithRefund(cart: Cart) {
    const price = cart.articles.reduce(
      (acc, c) => acc + Article.getPriceWithRefund(c),
      0
    );

    return price - (price * cart.refundPercent) / 100 - cart.refund;
  }

  export function getCartPriceWithoutRefund(cart: Cart) {
    return cart.articles.reduce((acc, c) => acc + c.price, 0);
  }

  export function getCartTotalRefund(cart: Cart) {
    return getCartPriceWithoutRefund(cart) - getCartPriceWithRefund(cart);
  }

  export function isAvailable(cart: Cart) {
    return cart.articles.every(c => c.available);
  }

  export function getCreationDate(cart) {
    return cart.creationDate.toLocaleDateString('fr-FR', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
  }
}

export default Cart;
