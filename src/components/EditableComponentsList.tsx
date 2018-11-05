import * as React from 'react';
import emotion from 'react-emotion';
import ComponentPC from '../Models/ComponentPC';
import Table, { Column, CellData } from './Table/Table';
import { DispoView, VerticalLayout, Link } from './SharedComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ButtonIcon from './ButtonIcon';
import TextInput from './TextInput';
import * as NumericInput from 'react-numeric-input';
import { getComments, addComment } from '../services/Storage';
import CommentInput from './CommentInput';

interface Props {
  components: ComponentPC[];
  onComponentChange?(component: ComponentPC): void;
  onDeleteComponent?(id: string): void;
  activeComment?: boolean;
}

interface State {
  comments: string[];
}

export default class EditableComponentsList extends React.Component<
  Props,
  State
> {
  state: State = {
    comments: []
  };
  componentDidMount = async () => {
    this.props.activeComment &&
      getComments().then(comments => {
        this.setState({ comments });
      });
  };

  onDeleteItem = (id: string): void => {
    this.props.onDeleteComponent && this.props.onDeleteComponent(id);
  };

  onComponentChange = (component: ComponentPC): void => {
    this.props.onComponentChange && this.props.onComponentChange(component);
  };

  onCreateComment = (component: ComponentPC, value: string) => {
    this.setState({ comments: [...this.state.comments, value] });
    addComment(value);
    component.comment = value;
    this.onComponentChange(component);
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
          <img src={original.imageUrl} alt={original.name} width="80px" />
        )
      },
      {
        header: 'Nom',
        accessor: 'name',
        alignHeader: 'left',
        cell: ({ original }: CellData): JSX.Element => (
          <VerticalLayout>
            <NameLink
              href={original.url}
              rel="noreferrer noopenner"
              target="_blanck">
              {original.name}
            </NameLink>
            {this.props.activeComment && (
              <CommentInput
                onChange={(value: string) => {
                  original.comment = value;
                  this.onComponentChange(original);
                }}
                onCreateOption={value => this.onCreateComment(original, value)}
                comments={this.state.comments}
              />
            )}
          </VerticalLayout>
        )
      },
      {
        header: 'Quantité',
        accessor: 'quantity',
        alignContent: 'center',
        width: 80,
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
        header: 'Remise (%)',
        accessor: 'refundPercent',
        alignHeader: 'center',
        alignContent: 'center',
        width: 80,
        cell: ({ original }) => (
          <NumberInput
            value={original.refundPercent}
            onChange={value => {
              original.refundPercent = value;
              this.onComponentChange(original);
            }}
            step={1}
            min={0}
            max={100}
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
        header: 'Remise',
        accessor: 'refund',
        alignHeader: 'center',
        alignContent: 'center',
        width: 80,
        cell: ({ original }) => (
          <NumberInput
            value={original.refund}
            onChange={value => {
              original.refund = value;
              this.onComponentChange(original);
            }}
            step={1}
            min={0}
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
        width: 90,
        accessor: o =>
          new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(ComponentPC.getTotalPrice(o)),
        alignContent: 'right'
      },
      {
        header: 'Dispo',
        accessor: 'available',
        alignHeader: 'center',
        alignContent: 'center',
        width: 80,
        cell: ({ value }) => <DispoView isDispo={value} />
      },
      {
        accessor: 'id',
        alignHeader: 'center',
        alignContent: 'center',
        width: 50,
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

const NameLink = emotion(Link)({
  marginBottom: '10px'
});
