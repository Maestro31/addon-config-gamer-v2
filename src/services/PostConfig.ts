import Config from '../Models/Config';
import { format } from 'util';

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

export const postConfig = (config: Config): void => {
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
          currency: config.monnaie
        }).format(c.price * c.quantity),
        'right'
      )
    ])
  });

  const messageElement = <HTMLTextAreaElement>(
    document.forms['postform']['message']
  );

  let text = `${table}`;

  messageElement.value = text;
};
