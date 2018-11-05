import * as React from 'react';
import Table, { CellData, Column } from './Table/Table';
import ComponentPC from '../Models/ComponentPC';
import { DispoView } from './SharedComponents';

interface Props {
  components: ComponentPC[];
}

export default class ComponentsListView extends React.Component<Props> {
  render() {
    const columns: Column[] = [
      {
        header: 'Aperçu',
        accessor: 'imageUrl',
        alignContent: 'center',
        alignHeader: 'center',
        width: 80,
        cell: ({ original }: CellData): JSX.Element => (
          <img src={original.imageUrl} alt={original.name} width="40px" />
        )
      },
      {
        header: 'Nom',
        accessor: 'name',
        alignHeader: 'left'
      },
      {
        header: 'Quantité',
        accessor: 'quantity',
        alignContent: 'center'
      },
      {
        header: 'Prix',
        accessor: 'price',
        alignContent: 'right',
        width: 100,
        cell: ({ original }: CellData): JSX.Element => (
          <span>
            {new Intl.NumberFormat('fr-FR', {
              minimumFractionDigits: 2
            }).format(original.price * original.quantity)}
          </span>
        )
      },
      {
        header: 'Dispo',
        accessor: 'availability',
        alignHeader: 'center',
        alignContent: 'center',
        cell: ({ value }) => <DispoView isDispo={value} />
      }
    ];

    return <Table data={this.props.components} columns={columns} />;
  }
}
