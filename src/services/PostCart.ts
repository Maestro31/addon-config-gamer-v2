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

export const postCart = (
  cart: Cart,
  messageIntro: string,
  message: string
): void => {
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
    `Prix total: ${new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: cart.reseller.currency
    }).format(Cart.getPriceWithRefund(cart))}`,
    ['b', 'right']
  );

  const totalRefund = Cart.getTotalRefund(cart);
  if (totalRefund > 0) {
    const cartRefund = surroundWithTag(
      `Remise totale: ${new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: cart.reseller.currency
      }).format(totalRefund)}`,
      'right'
    );
    cartPrice += `${cartRefund}\n\n`;
  }

  if (cart.priceInfo) {
    cartPrice += surroundWithTags(cart.priceInfo, ['i', 'right']);
  }

  const cartUrl = cart.url
    ? `Lien vers le panier: ${cart.url + cart.reseller.tag}`
    : '';

  responseText = `${messageIntro}\n\n\n${cartUrl}\n\n\n${table}\n\n\n${cartPrice}\n\n`;

  responseText += message ? `${message}\n\n` : '';

  const messageElement = <HTMLTextAreaElement>(
    document.forms['postform']['message']
  );

  console.log(cart);

  messageElement.value = responseText;
};
