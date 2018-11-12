import * as React from 'react';
import * as DOM from 'react-dom';
import chrome from '../services/Browser';
import Cart from '../Models/Cart';
import CartDialog from '../components/CartDialog';
import { postCart } from '../services/PostCart';

interface State {
  cart: Cart;
  openDialog: boolean;
  message: string;
  messageIntro: string;
}

export default class ConfigGamer extends React.Component<{}, State> {
  state = {
    cart: null,
    openDialog: false,
    message: '',
    messageIntro: ''
  };
  componentDidMount() {
    chrome.runtime.onMessage.addListener(msg => {
      if (
        msg.command &&
        msg.command === 'post_cart' &&
        msg.cart !== undefined
      ) {
        this.setState({
          cart: msg.cart,
          openDialog: true
        });
      } else {
        this.setState({
          cart: Cart.create(),
          openDialog: true
        });
      }
    });
  }

  onConfirmModal = (): void => {
    this.onCloseModal();
    postCart(this.state.cart, this.state.messageIntro, this.state.message);
  };

  onCloseModal = (): void => {
    this.setState({ openDialog: false, cart: null });
  };

  onCartChange = (cart: Cart): void => {
    this.setState({ cart });
  };

  render() {
    return (
      <>
        {this.state.cart && (
          <CartDialog
            mode="post"
            title="Poster les articles"
            submitButtonTitle="Poster"
            cart={this.state.cart}
            open={this.state.openDialog}
            onConfirmCart={this.onConfirmModal}
            onClose={this.onCloseModal}
            onCartChange={this.onCartChange}
            onMessageChange={message => this.setState({ message })}
            onMessageIntroChange={messageIntro =>
              this.setState({ messageIntro })
            }
          />
        )}
      </>
    );
  }
}

let root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);

DOM.render(<ConfigGamer />, document.getElementById('root'));
