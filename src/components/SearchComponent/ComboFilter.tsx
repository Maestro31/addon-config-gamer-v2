import * as React from 'react';
import emotion from 'react-emotion';

interface Props {
  filter: FilterData;
  onFilterChange?: (id: string, value: string, isChecked: boolean) => void;
}

interface State {
  height: string;
  filter: FilterData;
}

export default class ComboFilter extends React.Component<Props, State> {
  state = {
    height: '0px',
    filter: this.props.filter
  };

  componentDidUpdate = (prevProps: Props): void => {
    if (prevProps.filter === this.props.filter) return;

    this.setState({ filter: this.props.filter, height: '0px' });
  };

  toggleCombo = (e: React.MouseEvent) => {
    this.setState({ height: this.state.height === '20px' ? '0px' : '20px' });
  };

  onSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let filter = this.state.filter;
    filter.options.map(option => {
      if (option.value === e.target.value) option.selected = e.target.checked;
    });

    this.setState({ filter });

    this.props.onFilterChange &&
      this.props.onFilterChange(
        this.state.filter.id,
        e.target.value,
        e.target.checked
      );
  };

  render() {
    return (
      <Container>
        <Label onClick={this.toggleCombo}>
          {this.state.filter.label}
          <DownIcon>▼</DownIcon>
        </Label>
        <Combo>
          {this.state.filter.options.map((option, i) => (
            <ComboItem
              key={i}
              height={option.selected ? '20px' : this.state.height}>
              <Input
                type="checkbox"
                checked={option.selected}
                value={option.value}
                onChange={this.onSelectionChange}
              />
              {option.label}
            </ComboItem>
          ))}
        </Combo>
      </Container>
    );
  }
}

const Container = emotion('div')({
  marginBottom: '20px',
  textAlign: 'left',
  fontSize: '15px',
  boxSizing: 'border-box',
  fontFamily: 'Calibri',
  color: '#CCC'
});

const Label = emotion('label')({
  borderRadius: '3px 3px 0 0',
  marginBottom: '0',
  padding: '5px',
  border: '1px solid #303030',
  background: '#414141',
  fontWeight: 'bold',
  fontSize: '1.25em',
  width: '100%',
  display: 'block',
  cursor: 'pointer',
  boxSizing: 'border-box',
  color: '#FFF'
});

const DownIcon = emotion('div')({
  float: 'right',
  color: '#CCC'
});

const Combo = emotion('div')({
  borderTop: 0,
  borderRadius: '0 0 3px 3px',
  background: '#515151',
  border: '1px solid #454545',
  boxSizing: 'border-box',
  textAlign: 'left',
  fontSize: '12px',
  lineHeight: '1.5'
});

const Input = emotion('input')({
  display: 'inline',
  width: 'auto',
  marginRight: '5px',
  verticalAlign: 'middle',
  boxSizing: 'border-box'
});

const ComboItem = emotion('div')(
  {
    overflow: 'hidden',
    padding: '0 5px',
    boxSizing: 'border-box',
    transition: 'height 250ms ease'
  },
  ({ height }: any) => ({
    height
  })
);
