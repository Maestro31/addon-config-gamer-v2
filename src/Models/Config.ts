import Component from './Component';
import * as uuid from 'uuid/v4';

export interface ComparisonResult {
  componentsChanged?: {
    originalComponent: Component;
    dispo: boolean;
    price: number;
  }[];
}

export default class Config {
  protected _id: string = uuid();
  protected _creationDate: Date = new Date();

  owner: string = '';
  subjectId: string = '';
  components: Component[] = [];
  monnaie: string = 'EUR';
  modificationDate: Date;
  refund: number = 0;
  reseller: ResellerInfo;
  tags: string[] = [];

  static create(config: Config) {
    console.groupCollapsed('Copie de la config:');
    console.log(config);
    let c = new Config();
    c._id = config._id;
    c._creationDate = config._creationDate;
    c.owner = config.owner;
    c.subjectId = config.subjectId;
    c.monnaie = config.monnaie;
    c.modificationDate = config.modificationDate;
    c.reseller = config.reseller;
    c.tags = config.tags;
    c.components = config.components.map(c => Component.create(c));
    console.log(c);
    console.groupEnd();
    return c;
  }

  clone(): Config {
    return Config.create(this);
  }

  get id(): string {
    return this._id;
  }

  get price(): number {
    return (
      this.components.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ) - this.refund
    );
  }

  get instock(): boolean {
    return this.components.every(c => c.instock);
  }

  get creationDate(): string {
    return this._creationDate.toLocaleDateString('fr-FR', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
  }

  addComponent(component: Component) {
    this.components.push(component);
  }

  compareConfig(config: Config): ComparisonResult {
    let comparison: ComparisonResult = {
      componentsChanged: []
    };

    this.components.forEach((a, i) => {
      const b = config.components[i];

      if (b.instock !== a.instock || b.price !== a.price)
        comparison.componentsChanged.push({
          originalComponent: a,
          dispo: b.instock,
          price: b.price
        });
    });

    return comparison;
  }
}
