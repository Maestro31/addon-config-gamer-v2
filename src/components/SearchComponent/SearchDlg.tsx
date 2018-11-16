import * as React from 'react';
import emotion from 'react-emotion';
import Modal from '../Modal';
import ParserService from '../../services/Parsers/Parser';
import Article from '../../Models/Article';
import SearchArticlesList from './SearhArticlesList';
import Pagination from '../Pagination';
import TextInput from '../TextInput';
import { Button } from '../SharedComponents';
import Select from 'react-select';
import ReactLoading from 'react-loading';
import { GroupType } from 'react-select/lib/types';
import FormFilter from './FormFilter';

interface Props {
  onClose(): void;
  onConfirm(): void;
  submitButtonTitle?: string;
  cancelButtonTitle?: string;
  copyButtonTitle?: string;
  open: boolean;
}

interface SelectOption {
  label: string;
  value: string;
}

interface State {
  articles: Array<Article>;
  categories: ResellerCategory[];
  currentPage: number;
  pageCount: number;
  articlesCount?: number;
  filters?: FilterData[];
  filterValues: FilterValue[];
  searchText: string;
  selectedReseller: SelectOption;
  selectedCategory: ResellerCategory;
  isLoading: boolean;
  error?: string;
}

const initialState = {
  articles: [],
  categories: [],
  currentPage: 0,
  pageCount: 0,
  articlesCount: 0,
  searchText: '',
  isLoading: false,
  error: null,
  filters: [],
  filterValues: []
};

export default class SearchDlg extends React.Component<Props, State> {
  resellerOptions: { label: string; value: string }[];

  constructor(props: Props) {
    super(props);

    this.resellerOptions = ParserService.parsers.map(p => ({
      label: p.reseller.name,
      value: p.reseller.name.toLowerCase().replace(/\W/g, '')
    }));

    const categories = ParserService.getParserByName(
      this.resellerOptions[0].label
    ).config.categoryList;

    this.state = {
      ...initialState,
      selectedReseller: this.resellerOptions[0],
      categories,
      selectedCategory:
        categories.length > 0
          ? categories[0].options
            ? categories[0].options[0]
            : categories[0]
          : null
    };
  }

  search = (name: string, keys: SearchArgs) => {
    this.setState({ articles: [], isLoading: true, error: null });
    ParserService.searchArticle(name, keys)
      .then((response: SearchResponse) => {
        console.group('Résultat de la recherche');
        console.log(response);
        console.groupEnd();
        const {
          pageCount,
          currentPage,
          articlesCount,
          articles,
          filters,
          error
        } = response;
        this.setState({
          pageCount,
          currentPage,
          articlesCount,
          articles,
          filters,
          error,
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({ articles: [], isLoading: false, error });
      });
  };

  onClickSearch = (e?: React.MouseEvent<HTMLDivElement>): void => {
    const categories = this.state.selectedCategory.value.split('/');
    this.search(this.state.selectedReseller.label, {
      index: 1,
      categories,
      text: this.state.searchText,
      filterValues: this.state.filterValues
    });
  };

  onSelectionChange = (articles: Article[]): void => {
    console.log(articles);
  };

  onClose = (): void => {
    this.setState({ ...initialState });
    this.props.onClose && this.props.onClose();
  };

  onConfirm = (): void => {
    this.setState({ ...initialState });
    this.props.onConfirm && this.props.onConfirm();
  };

  onIndexChange = (index: number): void => {
    const categories = this.state.selectedCategory.value.split('/');
    this.search(this.state.selectedReseller.label, {
      index,
      categories,
      text: this.state.searchText
    });
  };

  onResellerChange = (option: SelectOption): void => {
    const parser = ParserService.getParserByName(option.label);
    const categories = parser.config.categoryList || [];

    const selectedCategory =
      categories.length > 0
        ? categories[0].options
          ? categories[0].options[0]
          : categories[0]
        : null;

    this.setState({
      selectedReseller: option,
      categories,
      selectedCategory
    });
  };

  onCategoryChange = (option: ResellerCategory): void => {
    this.setState({
      selectedCategory: option
    });

    const categories = option.value.split('/');
    this.search(this.state.selectedReseller.label, {
      index: 1,
      categories,
      text: this.state.searchText,
      filterValues: []
    });
  };

  onFiltersChange = (filterValues: FilterValue[]): void => {
    this.setState({ filterValues });

    const categories = this.state.selectedCategory.value.split('/');
    this.search(this.state.selectedReseller.label, {
      index: 1,
      categories,
      text: this.state.searchText,
      filterValues
    });
  };

  formatGroupLabel = (data: GroupType<any>): JSX.Element => {
    const groupStyles = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '15px',
      fontWeight: 600
    };
    const groupBadgeStyles = {
      backgroundColor: '#EBECF0',
      borderRadius: '2em',
      color: '#172B4D',
      display: 'inline-block',
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '12px',
      minWidth: 1,
      padding: '0.16666666666667em 0.5em'
    };

    return (
      <div style={groupStyles}>
        <span>{data.label}</span>
        <span style={groupBadgeStyles}>{data.options.length}</span>
      </div>
    );
  };

  render() {
    const { open, submitButtonTitle, cancelButtonTitle } = this.props;

    if (!open) return null;

    return (
      <Modal
        title="Rechercher"
        width={1200}
        submitButtonTitle={submitButtonTitle || 'Confirmer'}
        onClose={this.onClose}
        onConfirm={this.onConfirm}
        cancelButtonTitle={cancelButtonTitle}
        open={open}>
        <p>Recherche de composants</p>
        <Select
          defaultValue={this.state.selectedReseller}
          options={this.resellerOptions}
          isClearable={false}
          isSearchable={true}
          onChange={this.onResellerChange}
        />
        {this.state.categories && this.state.categories.length > 0 && (
          <Select
            value={this.state.selectedCategory}
            options={this.state.categories}
            isClearable={false}
            isSearchable={true}
            onChange={this.onCategoryChange}
            formatGroupLabel={this.formatGroupLabel}
          />
        )}

        {this.state.error && <p>{this.state.error}</p>}
        <SearchContainer>
          <FormFilter
            filters={this.state.filters}
            onFiltersChange={this.onFiltersChange}
          />
          <div style={{ width: '100%' }}>
            <Pagination
              currentIndex={this.state.currentPage}
              pageCount={this.state.pageCount}
              onIndexChange={this.onIndexChange}
            />
            {this.state.articles && this.state.articles.length > 0 && (
              <>
                <SearchArticlesList
                  articles={this.state.articles}
                  selectionChange={this.onSelectionChange}
                />
                <Pagination
                  currentIndex={this.state.currentPage}
                  pageCount={this.state.pageCount}
                  onIndexChange={this.onIndexChange}
                />
              </>
            )}
          </div>
        </SearchContainer>
      </Modal>
    );
  }
}

const Input = emotion(TextInput)({
  '& input': {
    width: '250px'
  }
});

const SearchButton = emotion(Button)({
  backgroundColor: '#333333',
  marginLeft: '5px'
});

const SearchContainer = emotion('div')({
  display: 'flex',
  flex: 1,
  flexDirection: 'row',
  alignItems: 'flex-start'
});

const Loading = emotion(ReactLoading)({
  '& svg': {
    position: 'relative',
    top: '-15px'
  }
});
