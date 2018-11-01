import * as uuid from 'uuid/v4';

export default class Component {
  protected _id: string = uuid();
  error: string = '';
  imageUrl: string = '#';
  name: string = '';
  price: number = 0;
  quantity: number = 1;
  url: string = '#';
  instock: boolean;
  comment: string = '';

  get id(): string {
    return this._id;
  }

  static create(component: Component) {
    let c = new Component();
    c._id = component._id;
    c.error = component.error;
    c.imageUrl = component.imageUrl;
    c.name = component.name;
    c.price = component.price;
    c.quantity = component.quantity;
    c.url = component.url;
    c.instock = component.instock;
    c.comment = component.comment;
    return c;
  }

  clone(): Component {
    return Component.create(this);
  }
}
