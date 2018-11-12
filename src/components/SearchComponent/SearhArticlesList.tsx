import * as React from 'react';
import Article from '../../Models/Article';
import Table, { Column, CellData, FilterInfo } from '../Table/Table';
import { DispoView, Link } from '../SharedComponents';

interface Props {
  articles: Article[];
  selectionChange(selectedArticles: Article[]);
}

interface State {
  selectedArticles: Article[];
}

export default class SearchArticlesList extends React.Component<
  Props,
  State
> {
  state = {
    selectedArticles: []
  };

  componentDidUpdate = (prevProps): void => {
    if (this.props.articles !== prevProps.articles)
      this.setState({ selectedArticles: [] });
  };

  onSelectItemChange = (article: Article, isSelected: boolean): void => {
    console.log({ article, isSelected });
    let selectedArticles = this.state.selectedArticles;

    if (isSelected) selectedArticles.push(article);
    else
    selectedArticles = selectedArticles.filter(
        item => item.id !== article.id
      );

    this.props.selectionChange &&
      this.props.selectionChange(selectedArticles);

    this.setState({ selectedArticles });
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
        filterMethod: (filter: FilterInfo, row: Article): boolean => {
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
    ];

    return <Table filterable columns={columns} data={this.props.articles} />;
  }
}
