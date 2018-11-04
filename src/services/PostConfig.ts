import Config from '../Models/Config';

interface Tag {
  name: string;
  value?: string;
}

const surroundByTag = (text: string, tag: string | Tag): string => {
  if (typeof tag === 'string') return `[${tag}]${text}[/${tag}]`;

  if (typeof tag === 'object') {
    const { name, value } = tag;
    return `[${name}${value ? '=' + value : ''}]${text}[/${name}]`;
  }
};

const surroundByTags = (
  text: string,
  [tag, ...tags]: Array<Tag | string>
): string => {
  if (!tag) return text;
  else return surroundByTags(surroundByTag(text, tag), tags);
};

const createTable = (table: {
  headers: Array<string>;
  rows: Array<Array<string>>;
}): string => {
  let tableContent: string = '';

  tableContent += surroundByTag(
    table.headers.reduce(
      (acc, header) => (acc += surroundByTag(header, 'td')),
      ''
    ),
    'tr'
  );

  tableContent += table.rows.reduce(
    (acc, row) =>
      (acc += surroundByTag(
        row.reduce((acc, col) => (acc += surroundByTag(col, 'td')), ''),
        'tr'
      )),
    ''
  );

  return surroundByTag(tableContent, 'table');
};

export const postConfig = (
  config: Config,
  messageIntro: string,
  message: string
): void => {
  let table = createTable({
    headers: [
      surroundByTags('Dispo', ['b', 'center']),
      surroundByTag('Désignation', 'b'),
      surroundByTag('Commentaire', 'b'),
      surroundByTags('Quantité', ['b', 'center']),
      surroundByTags('Prix', ['b', 'right'])
    ],
    rows: config.components.map(c => [
      surroundByTags('O', [
        'b',
        { name: 'color', value: c.instock ? '#44bb00' : '#880000' },
        'center'
      ]),
      surroundByTag(c.name, {
        name: 'url',
        value: c.url
      }),
      c.comment,
      surroundByTag(c.quantity.toString(), 'center'),
      surroundByTag(
        new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: config.currency
        }).format(c.price * c.quantity),
        'right'
      )
    ])
  });

  let responseText = '';

  let configPrice = surroundByTags(
    `Prix total: ${new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: config.reseller.currency
    }).format(config.price)}`,
    ['b', 'right']
  );

  if (config.refund > 0) {
    const configRefund = surroundByTag(
      `Remise: ${new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: config.reseller.currency
      }).format(config.refund)}`,
      'right'
    );
    configPrice += `${configRefund}\n\n`;
  }

  if (config.priceInfo) {
    configPrice += surroundByTags(config.priceInfo, ['i', 'right']);
  }

  const configLink = config.url
    ? `Lien vers la config: ${config.url + config.reseller.tag}`
    : '';

  responseText = `${messageIntro}\n\n\n${configLink}\n\n\n${table}\n\n\n${configPrice}\n\n`;

  responseText += message ? `${message}\n\n` : '';

  const messageElement = <HTMLTextAreaElement>(
    document.forms['postform']['message']
  );

  messageElement.value = responseText;
};
