import * as React from 'react';
import * as DOM from 'react-dom';
import chrome from '../services/Browser';
import Cart from '../Models/Cart';
import PostCartDialog from '../components/PostCartDialog';
import { postCarts } from '../services/PostCart';

interface State {
  carts: Cart[];
  openDialog: boolean;
  message: string;
  messageIntro: string;
}

export default class ConfigGamer extends React.Component<{}, State> {
  state = {
    carts: null,
    openDialog: false,
    message: '',
    messageIntro: ''
  };
  componentDidMount() {
    chrome.runtime.onMessage.addListener(msg => {
      if (
        msg.command &&
        msg.command === 'post_cart' &&
        msg.carts !== undefined
      ) {
        this.setState({
          carts: msg.carts,
          openDialog: true
        });
      } else {
        this.setState({
          carts: [],
          openDialog: true
        });
      }
    });
  }

  onConfirmModal = (): void => {
    this.onCloseModal();
    postCarts(this.state.carts, this.state.messageIntro, this.state.message);
  };

  onCloseModal = (): void => {
    this.setState({ openDialog: false, carts: null });
  };

  onCartsChange = (carts: Cart[]): void => {
    this.setState({ carts });
  };

  render() {
    return (
      <>
        {this.state.carts && (
          <PostCartDialog
            title="Poster les articles"
            submitButtonTitle="Poster"
            carts={this.state.carts}
            open={this.state.openDialog}
            onConfirmCarts={this.onConfirmModal}
            onClose={this.onCloseModal}
            onCartsChange={this.onCartsChange}
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
