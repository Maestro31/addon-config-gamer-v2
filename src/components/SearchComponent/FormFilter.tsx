import * as React from 'react';
import emotion from 'react-emotion';
import ComboFilter from './ComboFilter';
import RulerFilter from './RulerFilter';

interface Props {
  filters: FilterData[];
  onFiltersChange?: (filterValues: FilterValue[]) => void;
}

interface State {
  filters: FilterData[];
  filterValues: FilterValue[];
}

export default class FormFilter extends React.Component<Props, State> {
  state: State = {
    filters: [],
    filterValues: null
  };

  componentDidUpdate = (prevProps: Props): void => {
    if (prevProps.filters === this.props.filters) return;

    if (!this.props.filters || this.props.filters.length === 0) {
      this.setState({ filterValues: [] });
      this.props.onFiltersChange && this.props.onFiltersChange([]);
      return;
    }

    let filterValues = [];

    this.props.filters.forEach(filter => {
      if (filter.type === 'combo') {
        filter.options.forEach(option => {
          if (option.selected)
            filterValues.push({ id: filter.id, value: option.value });
        });
      } else {
        const value = filter.options
          .reduce(
            (acc, option) => (option.selected ? [...acc, option.value] : acc),
            []
          )
          .join('_');

        if (value !== '') filterValues.push({ id: filter.id, value });
      }
    });

    this.setState({ filters: this.props.filters || [], filterValues });
  };

  onFilterChange = (id: string, value: string, isChecked?: boolean): void => {
    let filterValues = this.state.filterValues || [];
    if (isChecked !== undefined) {
      if (isChecked) {
        filterValues.push({ id, value });
      } else {
        filterValues = filterValues.filter(
          filter => !(filter.id === id && filter.value === value)
        );
      }
    } else {
      let filter = filterValues.find(f => f.id === id);
      if (filter) {
        filter.value = value;
        filterValues = filterValues.map(f => (f.id === id ? filter : f));
      } else filterValues.push({ id, value });
    }

    this.setState({ filterValues });
    this.props.onFiltersChange && this.props.onFiltersChange(filterValues);
  };

  onResetFilters = (): void => {
    let filters = this.state.filters.map(filter => {
      filter.options = filter.options.map(option => ({
        label: option.label,
        value: option.value,
        selected: false
      }));
      return filter;
    });

    this.setState({ filters, filterValues: [] });
    this.props.onFiltersChange && this.props.onFiltersChange([]);
  };

  render() {
    if (!this.props.filters || this.props.filters.length === 0) return null;
    return (
      <Container>
        <FormContainer>
          {this.props.filters.map(
            (filter, i) =>
              filter.type === 'combo' ? (
                <ComboFilter
                  key={i}
                  filter={filter}
                  onFilterChange={this.onFilterChange}
                />
              ) : (
                <RulerFilter
                  key={i}
                  filter={filter}
                  onFilterChange={this.onFilterChange}
                />
              )
          )}
          <ResetButton onClick={this.onResetFilters}>
            Réinitialiser les filtres
          </ResetButton>
        </FormContainer>
      </Container>
    );
  }
}

const Container = emotion('div')({
  background: '#2D2D2D',
  padding: '0.5em 1em',
  borderRadius: '10px',
  minWidth: '320px',
  width: '320px',
  marginLeft: '5px',
  textAlign: 'center',
  fontSize: '1.25em',
  color: '#b9b9b9',
  boxSizing: 'border-box'
});

const FormContainer = emotion('div')({
  margin: 0,
  boxSizing: 'border-box'
});

const ResetButton = emotion('div')({
  cursor: 'pointer',
  padding: '5px',
  fontSize: '15px',
  color: '#EEE',
  background: '#454545',
  border: '1px solid  #333333',
  borderRadius: '5px',
  '&:hover': {
    background: '#545454'
  }
});
