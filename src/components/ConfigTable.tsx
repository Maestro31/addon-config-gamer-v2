import * as React from 'react';
import emotion from 'react-emotion';
import ReactTable from 'react-table';
import { faPen, faTrash, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import ButtonIcon from './ButtonIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ReactTooltip from 'react-tooltip';
import * as uuid from 'uuid/v4';

import 'react-table/react-table.css';
import SetupPC from '../Models/SetupPC';
import ComponentsListView from './ComponentsListView';

interface Props {
  configs: SetupPC[];
  onPressUpdateItem(config: SetupPC): void;
  onPressEditItem(config: SetupPC): void;
  onPressDeleteItem(id: string): void;
}

export default class ConfigTable extends React.Component<Props> {
  render() {
    if (!this.props.configs) return null;

    const columns = [
      {
        Header: 'Membre',
        id: 'owner',
        resizable: false,
        width: 150,
        accessor: c => c.owner,
        filterMethod: (filter, row) =>
          row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
      },
      {
        Header: 'Id du sujet',
        accessor: 'subjectId',
        resizable: false,
        width: 100,
        filterMethod: (filter, row) =>
          row[filter.id].startsWith(filter.value) &&
          row[filter.id].endsWith(filter.value),
        Cell: ({ value }) => (
          <a
            target="_blank"
            href={`https://www.config-gamer.fr/forum/4/${value}`}>
            {value}
          </a>
        )
      },
      {
        Header: 'Composants',
        accessor: 'components',
        minWidth: 100,
        filterMethod: (filter, row) => {
          console.log(
            row[filter.id].filter(c =>
              c.name.toUpperCase().includes(filter.value.toUpperCase())
            )
          );
          return (
            row[filter.id].filter(c =>
              c.name.toUpperCase().includes(filter.value.toUpperCase())
            ).length > 0
          );
        },
        Cell: ({ value }) => {
          const id = uuid();
          return (
            <div>
              <CellComponents data-tip data-for={id}>
                {value.map(
                  (item, i) =>
                    i != value.length - 1 ? item.name + ', ' : item.name
                )}
              </CellComponents>
              <Tooltip
                id={id}
                place="right"
                type="light"
                effect="float"
                getContent={() => <ComponentsListView components={value} />}
              />
            </div>
          );
        }
      },
      {
        Header: 'Tags',
        accessor: 'tags',
        minWidth: 100,
        filterMethod: (filter, row) => {
          return (
            row[filter.id].filter(tag =>
              tag.toUpperCase().includes(filter.value.toUpperCase())
            ).length > 0
          );
        },
        Cell: ({ value }) => (
          <span>
            {value &&
              value.map(
                (item, i) => (i != value.length - 1 ? item + ', ' : item)
              )}
          </span>
        )
      },
      {
        Header: 'Prix',
        id: 'price',
        accessor: o =>
          new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(SetupPC.getPriceWithRefund(o)),
        resizable: false,
        width: 120,
        Filter: () => null,
        Cell: ({ value }) => <RightCell>{value}</RightCell>
      },
      {
        Header: 'Date de création',
        id: 'creationDate',
        accessor: o => SetupPC.getCreationDate(o),
        resizable: false,
        width: 180,
        Cell: ({ value }) => <CenterCell>{value}</CenterCell>
      },
      {
        Header: 'Vendeur',
        accessor: 'reseller',
        resizable: false,
        width: 160,
        filterMethod: (filter, row) =>
          row[filter.id].name
            .toUpperCase()
            .includes(filter.value.toUpperCase()),
        Cell: ({ value }) => (
          <CenterCell>
            <a href={value.url} target="_blank">
              {value.name}
            </a>
          </CenterCell>
        )
      },
      {
        Header: 'Dispo.',
        id: 'available',
        accessor: o => SetupPC.isAvailable(o),
        resizable: false,
        width: 100,
        Cell: ({ value }) => (
          <CenterCell>
            <DispoView isDispo={value} />
          </CenterCell>
        ),
        filterMethod: (filter, row) => {
          if (filter.value === 'all') {
            return true;
          }
          if (filter.value === 'dispo') {
            return row[filter.id];
          }
          return !row[filter.id];
        },
        Filter: ({ filter, onChange }) => (
          <select
            onChange={event => onChange(event.target.value)}
            style={{ width: '100%' }}
            value={filter ? filter.value : 'all'}>
            <option value="all">Toutes</option>
            <option value="nondispo">Non dispo</option>
            <option value="dispo">Dispo</option>
          </select>
        )
      },
      {
        Header: 'Actions',
        accessor: 'id',
        sortable: false,
        resizable: false,
        width: 200,
        Filter: () => null,
        Cell: row => (
          <ButtonContainer>
            <ButtonIcon
              onClick={e => this.props.onPressUpdateItem(row.original)}>
              <FontAwesomeIcon icon={faSyncAlt} />
            </ButtonIcon>
            <ButtonIcon
              onClick={e => this.props.onPressEditItem(row.original.clone())}>
              <FontAwesomeIcon icon={faPen} />
            </ButtonIcon>
            <ButtonIcon onClick={e => this.props.onPressDeleteItem(row.value)}>
              <FontAwesomeIcon icon={faTrash} />
            </ButtonIcon>
          </ButtonContainer>
        )
      }
    ];

    return (
      <ReactTable data={this.props.configs} columns={columns} filterable />
    );
  }
}

const Tooltip = emotion(ReactTooltip)({
  border: '1px solid #353535',
  '&::after': {
    borderBottomColor: '#353535!important'
  }
});

const CellComponents = emotion('span')({
  cursor: 'pointer'
});

const DispoView = emotion('div')(
  {
    borderRadius: '100%',
    width: '20px',
    height: '20px'
  },
  ({ isDispo }: any) => ({
    backgroundColor: isDispo ? 'green' : 'red'
  })
);

const CenterCell = emotion('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center'
});

const RightCell = emotion('div')({
  display: 'flex',
  flexDirection: 'row-reverse',
  alignItems: 'center'
});

const ButtonContainer = emotion('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center'
});
