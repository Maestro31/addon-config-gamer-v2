import * as React from 'react'
import Table, {
  CellData,
  Column,
  FilterInfo,
  Filter
} from '../src/components/Table'
import { DispoView } from '../src/components/SharedComponents'

const columns: Column[] = [
  {
    header: 'Aperçu',
    accessor: 'imageUrl',
    alignContent: 'center',
    alignHeader: 'center',
    width: 80,
    cell: ({ original }: CellData) => (
      <img src={original.imageUrl} alt={original.name} width='40px' />
    )
  },
  {
    header: 'Nom',
    accessor: 'name',
    alignHeader: 'left',
    filterMethod: (filter, row) => {
      return row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
    }
  },
  {
    header: 'Prix',
    width: 100,
    id: 'price',
    filterMethod: (filter, row) => {
      return row[filter.id].toString().startsWith(filter.value)
    },
    accessor: o =>
      new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2
      }).format(o.price * o.quantity),
    alignContent: 'right'
  },
  {
    header: 'Dispo',
    width: 50,
    accessor: 'instock',
    alignHeader: 'center',
    alignContent: 'center',
    filter: ({ filter, onChange }: Filter) => (
      <select
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%' }}
        value={filter ? filter.value : 'all'}>
        <option value='all'>Toutes</option>
        <option value='nondispo'>Non dispo</option>
        <option value='dispo'>Dispo</option>
      </select>
    ),
    filterMethod: (filter: FilterInfo, row): boolean => {
      if (filter.value === 'all') {
        return true
      }
      if (filter.value === 'dispo') {
        return row[filter.id]
      }
      return !row[filter.id]
    },
    cell: ({ value }) => <DispoView isDispo={value} />
  }
]

export default {
  component: Table,
  props: {
    columns,
    filterable: true
  }
}
