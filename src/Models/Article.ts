import * as uuid from 'uuid/v4';

interface Article {
  readonly id: string;
  error?: string;
  imageUrl?: string;
  name?: string;
  price?: number;
  refund?: number;
  refundPercent?: number;
  quantity?: number;
  url?: string;
  available?: boolean;
  comment?: string;
}

namespace Article {
  export function create(): Article {
    return {
      id: uuid(),
      refund: 0,
      refundPercent: 0,
      quantity: 1
    };
  }

  export function getTotalPrice(article: Article): number {
    return (
      (article.price - (article.price * article.refundPercent) / 100 - article.refund) * article.quantity
    );
  }
}

export default Article;
