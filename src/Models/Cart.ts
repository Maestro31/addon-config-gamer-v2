import Article from './Article'
import * as uuid from 'uuid/v4'

interface Cart {
  readonly id: string
  readonly creationDate: Date
  owner?: string
  subjectId?: string
  articles?: Article[]
  modificationDate?: Date
  refund?: number
  refundPercent?: number
  reseller?: Reseller
  tags?: string[]
  url?: string
  priceInfo?: string
}

namespace Cart {
  export function create(): Cart {
    return {
      id: uuid(),
      creationDate: new Date(),
      refund: 0,
      refundPercent: 0,
      articles: []
    }
  }

  export function getTotalRefund(carts: Cart[]) {
    return getTotalPriceWithoutRefund(carts) - getTotalPriceWithRefund(carts)
  }

  export function getTotalPriceWithRefund(carts: Cart[]) {
    return carts.reduce((acc, cart) => acc + getCartPriceWithRefund(cart), 0)
  }

  export function getTotalPriceWithoutRefund(carts: Cart[]) {
    return carts.reduce((acc, cart) => acc + getCartPriceWithoutRefund(cart), 0)
  }

  export function getCartPriceWithRefund(cart: Cart) {
    const price = cart.articles.reduce(
      (acc, c) => acc + Article.getPriceWithRefund(c),
      0
    )

    const total = price - (price * cart.refundPercent) / 100 - cart.refund

    return Number(total.toFixed(2))
  }

  export function getCartPriceWithoutRefund(cart: Cart) {
    const total = cart.articles.reduce(
      (acc, c) => acc + Article.getPriceWithoutRefund(c),
      0
    )

    return Number(total.toFixed(2))
  }

  export function getCartTotalRefund(cart: Cart) {
    return getCartPriceWithoutRefund(cart) - getCartPriceWithRefund(cart)
  }

  export function isAvailable(cart: Cart) {
    return cart.articles.every(c => c.available)
  }

  export function getCreationDate(cart) {
    return cart.creationDate.toLocaleDateString('fr-FR', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
  }
}

export default Cart
