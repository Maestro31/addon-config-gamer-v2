import * as React from 'react'
import Cart from '../Models/Cart'
import Card from './Card'
import EditableArticlesList from './EditableArticlesList'
import Article from 'Models/Article'
import { RowReverseLayout, HorizontalLayout } from './SharedComponents'
import emotion from 'react-emotion'
import * as NumericInput from 'react-numeric-input'
import TextInput from './TextInput'

interface Props {
  carts: Cart[]
  onDeleteArticle: (index: number) => (id: string) => void
  onArticleChange: (index: number) => (article: Article) => void
  onCartChange: (index: number) => (cart: Cart) => void
}

export default class CartList extends React.Component<Props> {
  render() {
    return (
      this.props.carts &&
      this.props.carts.map((cart, i) => (
        <Card title={cart.reseller.name} key={i}>
          <HorizontalLayout>
            <Label>Lien vers le panier:</Label>
            <LinkInput
              value={cart.url || ''}
              onChange={url => {
                cart.url = url
                this.props.onCartChange(i)(cart)
              }}
            />
          </HorizontalLayout>
          <EditableArticlesList
            activeComment={true}
            articles={cart.articles}
            onDeleteArticle={this.props.onDeleteArticle(i)}
            onArticleChange={this.props.onArticleChange(i)}
          />
          <RowReverseLayout>
            <NumberInput
              value={cart.refund}
              onChange={value => {
                cart.refund = value
                this.props.onCartChange(i)(cart)
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
                this.props.onCartChange(i)(cart)
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
              Sous total:{' '}
              {`${new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: cart.reseller.currency
              }).format(Cart.getCartPriceWithRefund(cart))}`}
            </PriceText>
          </RowReverseLayout>
          <RowReverseLayout>
            <TitleH4>
              Remise:{' '}
              {`${new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: cart.reseller.currency
              }).format(Cart.getCartTotalRefund(cart))}`}
            </TitleH4>
          </RowReverseLayout>
        </Card>
      ))
    )
  }
}

const NumberInput = emotion(NumericInput)({
  width: '60px'
})

const Label = emotion('label')({
  fontSize: '15px',
  margin: '0px 10px 0px 0px',
  color: '#676767!important'
})

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

const LinkInput = emotion(TextInput)({
  width: '100%',
  '& input': {
    marginBottom: 0
  }
})
