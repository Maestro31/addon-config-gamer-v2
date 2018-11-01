import * as React from 'react';
import Component from '../../Models/Component';
import Table, { Column, CellData, FilterInfo } from '../Table/Table';
import { DispoView, Link } from '../SharedComponents';

interface Props {
  components: Component[];
  selectionChange(selectedItems: Component[]);
}

interface State {
  selectedComponents: Component[];
}

export default class SearchComponentsList extends React.Component<
  Props,
  State
> {
  state = {
    selectedComponents: []
  };

  componentDidUpdate = (prevProps): void => {
    if (this.props.components !== prevProps.components)
      this.setState({ selectedComponents: [] });
  };

  onSelectItemChange = (component: Component, isSelected: boolean): void => {
    console.log({ component, isSelected });
    let selectedComponents = this.state.selectedComponents;

    if (isSelected) selectedComponents.push(component);
    else
      selectedComponents = selectedComponents.filter(
        item => item.id !== component.id
      );

    this.props.selectionChange &&
      this.props.selectionChange(selectedComponents);

    this.setState({ selectedComponents });
  };

  render() {
    const columns: Column[] = [
      {
        header: 'Aperçu',
        accessor: 'imageUrl',
        alignContent: 'center',
        alignHeader: 'center',
        width: 80,
        cell: ({ original }: CellData) => (
          <img src={original.imageUrl} alt={original.name} width="40px" />
        )
      },
      {
        header: 'Nom',
        accessor: 'name',
        alignHeader: 'left',
        filterMethod: (filter: FilterInfo, row: Component): boolean => {
          return row[filter.id]
            .toUpperCase()
            .includes(filter.value.toUpperCase());
        },
        cell: ({ original }: CellData) => (
          <Link href={original.url} target="_blanck" rel="noopenner noreferrer">
            {original.name}
          </Link>
        )
      },
      {
        header: 'Prix',
        id: 'price',
        accessor: o =>
          new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 2
          }).format(o.price),
        alignContent: 'right'
      },
      {
        header: 'Dispo',
        accessor: 'instock',
        alignHeader: 'center',
        alignContent: 'center',
        cell: ({ value }) => <DispoView isDispo={value} />
      }
      // {
      //   accessor: 'id',
      //   alignHeader: 'center',
      //   alignContent: 'center',
      //   cell: ({ original }) => (
      //     <input
      //       type="checkbox"
      //       onChange={e => this.onSelectItemChange(original, e.target.checked)}
      //     />
      //   )
      // }
    ];

    return <Table filterable columns={columns} data={this.props.components} />;
  }
}
