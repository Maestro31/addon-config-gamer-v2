import * as React from 'react'
import Modal from './Modal'
import { VerticalLayout, RowReverseLayout } from './SharedComponents'
import TextInput from './TextInput'
import TagInput from './TagInput'
import { getTags } from '../services/Storage'
import Cart from '../Models/Cart'
import Item from '../Models/Item'
import emotion from 'react-emotion'
import * as NumericInput from 'react-numeric-input'
import EditableArticlesList from './EditableArticlesList'
import Card from './Card'
import Scrapper from '../services/Scrappers'

interface Props {
  open: boolean
  cart: Cart
  submitButtonTitle?: string
  title: string
  onClose(): void
  onMessageChange?: (text: string) => void
  onMessageIntroChange?: (text: string) => void
  onConfirmCart(cart: Cart): void
  onCopyCart?(): void
  onCartChange?(cart: Cart): void
  onDeleteArticle?(name: string): void
  renderFooter?(): JSX.Element
}

interface State {
  cart: Cart
  copiedCart: boolean
  message: string
  messageIntro: string
  isFetchingArticle: boolean
}

export default class CartDialog extends React.Component<Props, State> {
  state: State = {
    cart: this.props.cart,
    copiedCart: false,
    message: '',
    messageIntro: '',
    isFetchingArticle: false
  }

  onCartSubjectIdChange = (subjectId: string): void => {
    let cart = this.state.cart
    cart.subjectId = subjectId
    this.setState({
      cart: { ...this.state.cart, subjectId },
      copiedCart: false
    })
    this.onCartChange(cart)
  }

  onCartOwnerChange = (owner: string): void => {
    let cart = this.state.cart
    cart.owner = owner
    this.setState({
      cart: { ...this.state.cart, owner },
      copiedCart: false
    })
    this.onCartChange(cart)
  }

  onCartTagsChange = (tags: string[]): void => {
    let cart = this.state.cart
    cart.tags = tags
    this.setState({
      cart,
      copiedCart: false
    })
    this.onCartChange(cart)
  }

  onCartUrlChange = (url: string) => {
    let cart = this.state.cart
    cart.url = url
    this.setState({
      cart,
      copiedCart: false
    })
    this.onCartChange(cart)
  }

  onMessageChange = e => {
    const message = e.target.value
    this.setState({ message })
    this.props.onMessageChange && this.props.onMessageChange(message)
  }

  onMessageIntroChange = e => {
    const messageIntro = e.target.value
    this.setState({ messageIntro })
    this.props.onMessageIntroChange &&
      this.props.onMessageIntroChange(messageIntro)
  }

  onDeleteArticle = (id: string): void => {
    const articles = this.state.cart.items.filter(article => article.id !== id)
    this.setState({
      cart: { ...this.state.cart, items: articles },
      copiedCart: false
    })
  }

  onConfirmCart = (): void => {
    this.props.onConfirmCart(this.state.cart)
    this.setState({ copiedCart: false })
  }

  onArticleChange = (newArticle: Item): void => {
    const articles = this.state.cart.items.map(article => {
      if (article.name === name) {
        return newArticle
      }
      return article
    })

    this.setState({
      cart: { ...this.state.cart, items: articles },
      copiedCart: false
    })
  }

  onCartChange = (cart: Cart) => {
    this.props.onCartChange && this.props.onCartChange(cart)
  }

  onAddArticle = async (url: string) => {
    this.setState({ isFetchingArticle: true })
    const article = await Scrapper.getItemFromUrl(url)
    if (article) {
      this.setState({ isFetchingArticle: false })
      let cart = this.state.cart
      cart.items.push(article)
      this.setState({ cart })

      this.onCartChange(cart)
    }
  }

  render() {
    if (!this.props.open) return null

    const { submitButtonTitle, title } = this.props
    const { cart } = this.state
    const currency = (cart && cart.reseller && cart.reseller.currency) || 'EUR'

    return (
      <Modal
        {...this.props}
        title={title}
        height={950}
        width={1200}
        submitButtonTitle={submitButtonTitle || 'Confirmer'}
        onConfirm={this.onConfirmCart}>
        <Card title='Informations'>
          <VerticalLayout>
            <TextInput
              label='Id du sujet:'
              value={cart.subjectId || ''}
              onChange={this.onCartSubjectIdChange}
            />
            <TextInput
              label='Membre:'
              value={cart.owner || ''}
              onChange={this.onCartOwnerChange}
            />
            <TagInput
              getTags={getTags}
              value={cart.tags}
              onChange={this.onCartTagsChange}
            />
          </VerticalLayout>
        </Card>
        <Card title='Les articles'>
          <EditableArticlesList
            articles={cart.items}
            activeComment={false}
            onDeleteArticle={this.onDeleteArticle}
            onArticleChange={this.onArticleChange}
          />
        </Card>
        <RowReverseLayout>
          <NumberInput
            value={cart.refund}
            onChange={value => {
              cart.refund = value
              this.onCartChange(cart)
            }}
            step={1}
            min={0}
            size={2}
            style={{
              input: {
                height: '30px',
                margin: '0px'
              }
            }}
          />
          <Label>&nbsp;%</Label>
          <NumberInput
            value={cart.refundPercent}
            onChange={value => {
              cart.refundPercent = value
              this.onCartChange(cart)
            }}
            step={1}
            min={0}
            max={100}
            size={2}
            style={{
              input: {
                height: '30px',
                margin: '0px'
              }
            }}
          />
          <Label>Remise globale:</Label>
        </RowReverseLayout>
        <RowReverseLayout>
          <PriceText>
            Prix total:{' '}
            {`${new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: currency
            }).format(Cart.getCartPriceWithRefund(cart))}`}
          </PriceText>
        </RowReverseLayout>
        {(cart.refund !== 0 || cart.refundPercent !== 0) && (
          <RowReverseLayout>
            <TitleH4>
              Remise:{' '}
              {`${new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: currency
              }).format(Cart.getCartTotalRefund(cart))}`}
            </TitleH4>
          </RowReverseLayout>
        )}
      </Modal>
    )
  }
}

const PriceText = emotion('h3')({
  fontSize: '21px',
  fontWeight: 500,
  color: '#D7D7D7'
})

const TitleH4 = emotion('h4')({
  fontSize: '18px',
  fontWeight: 400,
  marginTop: 0,
  marginBottom: '5px'
})

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
})

const Label = emotion('label')({
  fontSize: '15px',
  margin: '0px 10px 0px 0px',
  color: '#676767!important'
})

const LinkInput = emotion(TextInput)({
  width: '100%'
})

const NumberInput = emotion(NumericInput)({
  width: '60px'
})
