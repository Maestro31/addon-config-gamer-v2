import * as React from 'react';
import emotion from 'react-emotion';
import * as DOM from 'react-dom';
import Menu from '../components/Menu';
import ParserService from '../services/Parsers/Parser';
import CartDialog from '../components/CartDialog';
import { saveCartMessage, sendMessage } from '../services/Messages';
import Cart from '../Models/Cart';
import { copyCartMessage } from '../services/Messages';
import { Button } from '../components/SharedComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import chrome from '../services/Browser';

interface State {
  openDialog: boolean;
  cart: Cart;
  copiedCart: boolean;
}

export default class Main extends React.Component<{}, State> {
  state: State = {
    openDialog: false,
    cart: null,
    copiedCart: false
  };

  componentWillMount = () => {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg && msg.command === 'copy_cart') {
        const cart = ParserService.parseSetupPC();
        sendResponse(cart);
      }
    });
  };

  onSaveCart = () => {
    const cart = ParserService.parseSetupPC();
    this.setState({ cart, openDialog: true, copiedCart: false });
  };

  onSettingsClick = () => {
    sendMessage('open_options');
  };

  onCloseModal = () => {
    this.setState({ openDialog: false, cart: null, copiedCart: false });
  };

  onConfirmModal = (cart: Cart) => {
    this.onCloseModal();
    saveCartMessage(cart);
  };

  onCopyCart = () => {
    this.setState({ copiedCart: true });
    copyCartMessage(this.state.cart);
  };

  onCartChange = (cart: Cart) => {
    this.setState({ cart });
  };

  render() {
    return (
      <>
        <Menu
          onSaveCart={this.onSaveCart}
          onSettingsClick={this.onSettingsClick}
        />
        {this.state.cart && (
          <CartDialog
            mode="editable"
            title="Nouveau panier"
            submitButtonTitle="Sauvegarder"
            cart={this.state.cart}
            onCartChange={this.onCartChange}
            open={this.state.openDialog}
            onConfirmCart={this.onConfirmModal}
            onClose={this.onCloseModal}
            renderFooter={() => (
              <CopyButton onClick={this.onCopyCart}>
                Copier les articles
                {this.state.copiedCart && <CheckIcon icon={faCheck} />}
              </CopyButton>
            )}
          />
        )}
      </>
    );
  }
}

const CopyButton = emotion(Button)({
  backgroundColor: '#1c7eb5',
  marginLeft: '10px'
});

const CheckIcon = emotion(FontAwesomeIcon)({
  marginLeft: '5px'
});

let root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);

DOM.render(<Main />, document.getElementById('root'));
