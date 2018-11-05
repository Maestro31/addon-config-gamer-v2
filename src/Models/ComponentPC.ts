import * as uuid from 'uuid/v4';

interface ComponentPC {
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

namespace ComponentPC {
  export function create(): ComponentPC {
    return {
      id: uuid(),
      refund: 0,
      refundPercent: 0,
      quantity: 1
    };
  }

  export function getTotalPrice(c: ComponentPC): number {
    return (
      (c.price - (c.price * c.refundPercent) / 100 - c.refund) * c.quantity
    );
  }
}

export default ComponentPC;
