import * as React from 'react';
import Modal from './Modal';
import { RowReverseLayout } from './SharedComponents';
import Cart from '../Models/Cart';
import Article from '../Models/Article';
import emotion from 'react-emotion';
import ScrapperService from '../services/Scrappers/index';
import AddArticleButton from './AddArticleButton';
import CartList from './CartList';

interface Props {
  open: boolean;
  carts: Cart[];
  submitButtonTitle?: string;
  title: string;
  onClose(): void;
  onMessageChange?: (text: string) => void;
  onMessageIntroChange?: (text: string) => void;
  onConfirmCarts(carts: Cart[]): void;
  onCopyCart?(): void;
  onCartsChange?(carts: Cart[]): void;
  onDeleteArticle?(name: string): void;
  renderFooter?(): JSX.Element;
}

interface State {
  carts: Cart[];
  isFetchingArticle: boolean;
}

export default class CartDialog extends React.Component<Props, State> {
  state: State = {
    carts: this.props.carts,
    isFetchingArticle: false
  };

  onDeleteArticle = (index: number) => (id: string): void => {
    this.state.carts[index].articles = this.state.carts[index].articles.filter(
      article => article.id !== id
    );

    if (this.state.carts[index].articles.length === 0)
      delete this.state.carts[index];

    this.setState({
      carts: this.state.carts
    });
  };

  onConfirmCart = (): void => {
    this.props.onConfirmCarts(this.state.carts);
  };

  onArticleChange = (index: number) => (newArticle: Article): void => {
    let carts = this.state.carts;
    carts[index].articles = carts[index].articles.map(article => {
      if (article.name === name) {
        return newArticle;
      }
      return article;
    });

    this.setState({ carts });

    this.onCartsChange(carts);
  };

  onCartsChange = (carts: Cart[]) => {
    this.props.onCartsChange && this.props.onCartsChange(carts);
  };

  onCartChange = (index: number) => (cart: Cart) => {
    let carts = this.state.carts;
    carts[index] = cart;
    this.setState({ carts });

    this.onCartsChange(carts);
  };

  onAddArticle = async (url: string) => {
    this.setState({ isFetchingArticle: true });
    const article = await ScrapperService.retrieveArticle(url);
    let carts = this.state.carts;
    if (article) {
      this.setState({ isFetchingArticle: false });

      const index = carts.findIndex(
        cart => cart.reseller.name === article.reseller.name
      );

      if (index == -1) {
        let cart = Cart.create();
        cart.reseller = article.reseller;
        cart.articles.push(article);
        carts.push(cart);
      } else {
        carts[index].articles.push(article);
      }

      this.setState({ carts });
    }

    this.setState({ isFetchingArticle: false });

    this.onCartsChange(carts);
  };

  render() {
    if (!this.props.open) return null;

    const { submitButtonTitle, title } = this.props;
    const currency =
      (this.state.carts &&
        this.state.carts.length !== 0 &&
        this.state.carts[0].reseller.currency) ||
      'EUR';

    return (
      <Modal
        {...this.props}
        title={title}
        height={950}
        width={1200}
        submitButtonTitle={submitButtonTitle || 'Confirmer'}
        onConfirm={this.onConfirmCart}>
        <Label>Message:</Label>
        <TextArea
          onChange={e => this.props.onMessageIntroChange(e.target.value)}
        />
        <CartList
          carts={this.state.carts}
          onArticleChange={this.onArticleChange}
          onDeleteArticle={this.onDeleteArticle}
          onCartChange={this.onCartChange}
        />
        <AddArticleButton
          onSubmit={this.onAddArticle}
          loading={this.state.isFetchingArticle}
        />
        <RowReverseLayout>
          <PriceText>
            Prix total:{' '}
            {`${new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency
            }).format(Cart.getTotalPriceWithRefund(this.state.carts))}`}
          </PriceText>
        </RowReverseLayout>
        <RowReverseLayout>
          <TitleH4>
            Remise:{' '}
            {`${new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency
            }).format(Cart.getTotalRefund(this.state.carts))}`}
          </TitleH4>
        </RowReverseLayout>
        <Label>Message:</Label>
        <TextArea onChange={e => this.props.onMessageChange(e.target.value)} />
      </Modal>
    );
  }
}

const PriceText = emotion('h3')({
  fontSize: '21px',
  fontWeight: 500,
  color: '#D7D7D7'
});

const TitleH4 = emotion('h4')({
  fontSize: '18px',
  fontWeight: 400,
  marginTop: 0,
  marginBottom: '5px'
});

const TextArea = emotion('textarea')({
  width: '100%',
  boxSizing: 'border-box',
  height: '150px',
  background: '#333',
  color: '#FFF',
  marginTop: '5px',
  '&:focus': {
    background: '#333',
    color: '#FFF'
  }
});

const Label = emotion('label')({
  fontSize: '15px',
  margin: '0px 10px 0px 0px',
  color: '#676767!important'
});
