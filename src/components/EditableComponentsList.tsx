import * as React from 'react';
import emotion from 'react-emotion';
import Component from '../Models/Component';
import Table, { Column, CellData } from './Table/Table';
import { DispoView, VerticalLayout, Link } from './SharedComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ButtonIcon from './ButtonIcon';
import TextInput from './TextInput';
import * as NumericInput from 'react-numeric-input';

interface Props {
  components: Component[];
  onComponentChange?(component: Component): void;
  onDeleteComponent?(id: string): void;
}

export default class EditableComponentsList extends React.Component<Props> {
  onDeleteItem = (id: string): void => {
    this.props.onDeleteComponent && this.props.onDeleteComponent(id);
  };

  onComponentChange = (component: Component): void => {
    this.props.onComponentChange && this.props.onComponentChange(component);
  };

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
        alignHeader: 'left',
        cell: ({ original }: CellData): JSX.Element => (
          <VerticalLayout>
            <Link
              href={original.url}
              rel="noreferrer noopenner"
              target="_blanck">
              {original.name}
            </Link>
            <TextInput
              onChange={(value: string) => {
                original.comment = value;
                this.onComponentChange(original);
              }}
            />
          </VerticalLayout>
        )
      },
      {
        header: 'Quantité',
        accessor: 'quantity',
        alignContent: 'center',
        cell: ({ original }: CellData): JSX.Element => (
          <NumberInput
            value={original.quantity}
            onChange={value => {
              original.quantity = value;
              this.onComponentChange(original);
            }}
            step={1}
            min={1}
            size={2}
            style={{
              input: {
                height: '30px',
                margin: '0px'
              }
            }}
          />
        )
      },
      {
        header: 'Prix',
        id: 'price',
        accessor: o =>
          new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 2
          }).format(o.price * o.quantity),
        alignContent: 'right',
        width: 100
      },
      {
        header: 'Dispo',
        accessor: 'instock',
        alignHeader: 'center',
        alignContent: 'center',
        cell: ({ value }) => <DispoView isDispo={value} />
      },
      {
        accessor: 'id',
        alignHeader: 'center',
        alignContent: 'center',
        cell: ({ original }) => (
          <ButtonIcon onClick={e => this.onDeleteItem(original.id)}>
            <CloseIcon icon={faTimes} />
          </ButtonIcon>
        )
      }
    ];

    return <Table data={this.props.components} columns={columns} />;
  }
}

const CloseIcon = emotion(FontAwesomeIcon)({
  fontSize: '1.2em'
});

const NumberInput = emotion(NumericInput)({
  width: '60px'
});
