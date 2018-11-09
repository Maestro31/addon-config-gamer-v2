import ComponentPC from './ComponentPC';
import * as uuid from 'uuid/v4';

interface SetupPC {
  readonly id: string;
  readonly creationDate: Date;
  owner?: string;
  subjectId?: string;
  components?: ComponentPC[];
  //currency?: string;
  modificationDate?: Date;
  refund?: number;
  refundPercent?: number;
  reseller?: ResellerInfo;
  tags?: string[];
  url?: string;
  priceInfo?: string;
}

namespace SetupPC {
  export function create(): SetupPC {
    return {
      id: uuid(),
      creationDate: new Date(),
      refund: 0,
      refundPercent: 0,
      components: []
    };
  }

  export function getPriceWithRefund(config: SetupPC) {
    const price = config.components.reduce(
      (acc, c) => acc + ComponentPC.getTotalPrice(c),
      0
    );

    return price - (price * config.refundPercent) / 100 - config.refund;
  }

  export function getPriceWithoutRefund(config: SetupPC) {
    return config.components.reduce((acc, c) => acc + c.price, 0);
  }

  export function getTotalRefund(config: SetupPC) {
    return getPriceWithoutRefund(config) - getPriceWithRefund(config);
  }

  export function isAvailable(config: SetupPC) {
    return config.components.every(c => c.available);
  }

  export function getCreationDate(config) {
    return config.creationDate.toLocaleDateString('fr-FR', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
  }
}

export default SetupPC;
