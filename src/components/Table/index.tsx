import * as React from 'react';
import emotion from 'react-emotion';

export interface CellData {
  value: any;
  original: any;
}

export interface Column {
  header?: string;
  id?: string;
  accessor?: ((value: any) => string) | string;
  minWidth?: number;
  width?: number;
  alignHeader?: 'left' | 'right' | 'center';
  alignContent?: 'left' | 'right' | 'center';
  cell?: (cellObject: CellData) => JSX.Element;
  sortable?: boolean;
  filter?: (filter: Filter) => JSX.Element;
  filterMethod?: (filter: { id: string; value: any }, row: any) => boolean;
}

export interface FilterInfo {
  id: string;
  value?: string;
}

export interface Filter {
  filter: FilterInfo;
  onChange: (value: any) => void;
}

interface Props {
  columns: Column[];
  data: any[];
  filterable?: boolean;
}

interface State {
  data: any[];
}

export default class Table extends React.Component<Props, State> {
  state: State = {
    data: this.props.data
  };

  componentDidUpdate = prevProps => {
    if (this.props.data !== prevProps.data) {
      this.setState({ data: this.props.data });
    }
  };

  filterTable = (
    filter: FilterInfo,
    filterMethod: (filter: FilterInfo, row: any) => boolean
  ): void => {
    if (filterMethod === undefined) return;

    const filteredRows = this.props.data.filter(item =>
      filterMethod(filter, item)
    );

    this.setState({ data: filteredRows });
  };

  createFilterInput = (column: Column): JSX.Element => {
    if (!column.filterMethod) return null;

    if (column.filter) {
      return column.filter({
        filter: {
          id: typeof column.accessor === 'string' ? column.accessor : column.id
        },
        onChange: value =>
          this.filterTable(
            {
              id:
                typeof column.accessor === 'string'
                  ? column.accessor
                  : column.id,
              value
            },
            column.filterMethod
          )
      });
    } else
      return (
        <input
          type="text"
          onChange={e =>
            this.filterTable(
              {
                id:
                  typeof column.accessor === 'string'
                    ? column.accessor
                    : column.id,
                value: e.target.value
              },
              column.filterMethod
            )
          }
          style={{ width: '100%' }}
        />
      );
  };

  createCell = (column: Column, row: any, key: number): JSX.Element => {
    let value: string = '';

    if (typeof column.accessor === 'string') value = row[column.accessor];
    else if (typeof column.accessor === 'function')
      value = column.accessor(row);

    return (
      <Td key={key} alignContent={column.alignContent}>
        {column.cell ? column.cell({ value, original: row }) : value}
      </Td>
    );
  };

  createTable = (): JSX.Element => {
    if (!this.props.columns) return null;

    let header: JSX.Element = (
      <thead>
        <tr>
          {this.props.columns.map(
            (c: Column, i: number): JSX.Element => (
              <Th
                key={i}
                alignHeader={c.alignHeader}
                minWidth={c.minWidth}
                width={c.width}>
                {c.header}
              </Th>
            )
          )}
        </tr>
        {this.props.filterable && (
          <tr>
            {this.props.columns.map(
              (c: Column, i: number): JSX.Element => (
                <Th key={i}>{this.createFilterInput(c)}</Th>
              )
            )}
          </tr>
        )}
      </thead>
    );

    let body: JSX.Element = (
      <tbody>
        {this.state.data.map(
          (row: any, i: number): JSX.Element => (
            <Tr key={i}>
              {this.props.columns.map(
                (c: Column, j: number): JSX.Element =>
                  this.createCell(c, row, j)
              )}
            </Tr>
          )
        )}
      </tbody>
    );

    return (
      <>
        {header}
        {body}
      </>
    );
  };

  render() {
    return <Container>{this.createTable()}</Container>;
  }
}

const Container = emotion('table')({
  width: '100%',
  color: '#D7D7D7'
});

const Tr = emotion('tr')({
  '&:hover': {
    backgroundColor: '#252525'
  }
});

const Th = emotion('th')(
  {
    verticalAlign: 'middle',
    padding: '5px 5px',
    flex: '100 0 auto'
  },
  ({ width, minWidth, alignHeader }: any) => ({
    minWidth: minWidth ? `${minWidth}px` : '',
    flex: width ? `${width} 0 auto` : '100 0 auto',
    textAlign: alignHeader || 'center'
  })
);

const Td = emotion('td')(
  {
    verticalAlign: 'middle',
    padding: '5px 5px'
  },
  ({ alignContent }: any) => ({
    textAlign: alignContent || 'left',
    '& *': {
      margin: alignContent ? '0 auto' : 'inherit'
    }
  })
);
