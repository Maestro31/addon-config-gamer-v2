import Cart from '../Models/Cart';

interface Tag {
  name: string;
  value: string;
}

export const surroundWithTag = (text: string, tag: string | Tag): string => {
  if (!text || text === '') return `[${tag}][/${tag}]`;

  if (typeof tag === 'string') return `[${tag}]${text}[/${tag}]`;

  if (typeof tag === 'object') {
    const { name, value } = tag;

    if (!value || value === '') return text;

    return `[${name}${value ? '=' + value : ''}]${text}[/${name}]`;
  }
};

export const surroundWithTags = (
  text: string,
  [tag, ...tags]: Array<Tag | string>
): string => {
  if (!tag) return text;
  else return surroundWithTags(surroundWithTag(text, tag), tags);
};

export const createTable = (table: {
  headers: Array<string>;
  rows: Array<Array<string>>;
}): string => {
  let tableContent: string = '';

  tableContent += surroundWithTag(
    table.headers.reduce(
      (acc, header) => (acc += surroundWithTag(header, 'td')),
      ''
    ),
    'tr'
  );

  tableContent += table.rows.reduce(
    (acc, row) =>
      (acc += surroundWithTag(
        row.reduce((acc, col) => (acc += surroundWithTag(col, 'td')), ''),
        'tr'
      )),
    ''
  );

  return surroundWithTag(tableContent, 'table');
};

export const postCarts = (
  carts: Cart[],
  messageIntro: string,
  message: string
) => {
  let text = `${messageIntro ? messageIntro + '\n\n\n' : ''}`;

  carts.forEach(cart => {
    text += postCart(cart);
  });

  if (carts.length > 1) {
    text +=
      '\n\n' +
      surroundWithTags(
        `Total: ${new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: carts[0].reseller.currency
        }).format(Cart.getTotalPriceWithRefund(carts))}`,
        ['b', { name: 'size', value: '6' }, 'right']
      ) +
      '\n';

    text +=
      surroundWithTags(
        `Remise incluse: ${new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: carts[0].reseller.currency
        }).format(Cart.getTotalRefund(carts))}`,
        ['b', { name: 'size', value: '5' }, 'right']
      ) + '\n\n';
  }

  text += `${message ? message : ''}`;

  const messageElement = <HTMLTextAreaElement>(
    document.forms['postform']['message']
  );

  console.log(carts);

  messageElement.value = text;
};

export const postCart = (cart: Cart): string => {
  let table = createTable({
    headers: [
      surroundWithTags('Dispo', ['b', 'center']),
      surroundWithTag('Désignation', 'b'),
      surroundWithTag('Commentaire', 'b'),
      surroundWithTags('Quantité', ['b', 'center']),
      surroundWithTags('Prix', ['b', 'right'])
    ],
    rows: cart.articles.map(c => [
      surroundWithTags('O', [
        'b',
        { name: 'color', value: c.available ? '#44bb00' : '#880000' },
        'center'
      ]),
      surroundWithTag(c.name, {
        name: 'url',
        value: c.url || cart.reseller.url + cart.reseller.tag
      }),
      c.comment || '',
      surroundWithTag(c.quantity.toString(), 'center'),
      surroundWithTag(
        new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: cart.reseller.currency
        }).format(c.price * c.quantity),
        'right'
      )
    ])
  });

  let responseText = '';

  let cartPrice = surroundWithTags(
    `Total: ${new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: cart.reseller.currency
    }).format(Cart.getCartPriceWithRefund(cart))}`,
    ['b', 'right']
  );

  const totalRefund = Cart.getCartTotalRefund(cart);
  if (totalRefund > 0) {
    const cartRefund = surroundWithTag(
      `Dont remise: ${new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: cart.reseller.currency
      }).format(totalRefund)}`,
      'right'
    );
    cartPrice += `${cartRefund}\n\n`;
  }

  // TODO: Partie à revoir, pas assez générique

  if (
    cart.reseller.name === 'Top Achat' &&
    cart.priceInfo &&
    Cart.getCartPriceWithoutRefund(cart) > 1000
  ) {
    cartPrice += surroundWithTags(cart.priceInfo, ['i', 'right']);
  }
  const mounting = cart.articles.some(
    article => !!article.name.match(/(M|m)ontage/)
  );
  const deliveryInfo =
    surroundWithTags(
      'Attention, les frais de livraison sont plus élevés lorsque les configs sont montées par le revendeur (+/- 35€)',
      [{name: 'color', value: '#BB0000'}, 'i', 'right']
    ) + '\n\n';

  const cartResellerName = cart.reseller.name
    ? surroundWithTags(
        `Panier ${cart.reseller.name}`,
        ['b', { name: 'size', value: '5' }]
      ) + '\n\n'
    : '';

  const cartUrl = cart.url
    ? `Lien vers le panier: ${cart.url +
        (cart.reseller.tag ? cart.reseller.tag + '\n\n\n' : '')}`
    : '';

  responseText = `${cartResellerName}${cartUrl ||
    '\n'}${table}\n\n\n${cartPrice}\n\n${mounting ? deliveryInfo : ''}`;

  return responseText;
};
