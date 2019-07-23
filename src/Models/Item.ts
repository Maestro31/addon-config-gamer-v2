import * as uuid from 'uuid/v4'

interface Item {
  readonly id: string
  error?: string
  imageUrl?: string
  name?: string
  price?: number
  refund?: number
  refundPercent?: number
  quantity?: number
  url?: string
  available?: boolean
  comment?: string
  reseller?: Reseller
}

namespace Item {
  export function create(): Item {
    return {
      id: uuid(),
      refund: 0,
      refundPercent: 0,
      quantity: 1
    }
  }

  export function getPriceWithRefund(article: Item): number {
    return (
      (article.price -
        (article.price * article.refundPercent) / 100 -
        article.refund) *
      article.quantity
    )
  }

  export function getPriceWithoutRefund(article: Item): number {
    return article.price * article.quantity
  }
}

export default Item
