import * as React from 'react';
import emotion from 'react-emotion';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

interface Props {
  filter: FilterData;
  onFilterChange?: (id: string, value: string) => void;
}

const railStyle = {
  height: '20px',
  background: 'rgb(86, 86, 86)',
  border: '1px solid rgb(74, 74, 74)',
  borderRadius: '20px'
};

const handleStyle = {
  background: 'rgb(17, 128, 255)',
  marginLeft: '-13px',
  top: '6px',
  width: '26px',
  height: '26px',
  borderRadius: '26px',
  border: 'none',
  cursor: 'pointer'
};

const trackStyle = {
  background: 'none'
};

interface State {
  filter: FilterData;
  minValue: string;
  maxValue: string;
  sliderValue: number[];
}

export default class RulerFilter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let selectedIndexes = this.getSelectedIndex(props.filter);
    if (selectedIndexes.length < 2)
      selectedIndexes = [0, props.filter.options.length - 1];

    this.state = {
      filter: props.filter,
      minValue: props.filter.options[selectedIndexes[0]].label,
      maxValue: props.filter.options[selectedIndexes[1]].label,
      sliderValue: selectedIndexes
    };
  }
  getSelectedIndex = (filter: FilterData): number[] => {
    let selectedIndexes = [];
    filter.options.forEach((option, i) => {
      option.selected ? selectedIndexes.push(i) : null;
    });

    if (selectedIndexes.length < 2)
      selectedIndexes = [0, filter.options.length - 1];

    return selectedIndexes;
  };

  componentDidUpdate = (prevProps: Props): void => {
    if (prevProps.filter === this.props.filter) return;

    let selectedIndexes = this.getSelectedIndex(this.props.filter);
    if (selectedIndexes.length < 2)
      selectedIndexes = [0, this.props.filter.options.length - 1];

    this.setState({
      minValue: this.props.filter.options[selectedIndexes[0]].label,
      maxValue: this.props.filter.options[selectedIndexes[1]].label,
      sliderValue: selectedIndexes,
      filter: this.props.filter
    });
  };

  onChange = (values: Array<number>): void => {
    let filter = this.state.filter;
    filter.options.forEach(option => {
      option.selected = false;
    });

    filter.options[values[0]].selected = true;
    filter.options[values[1]].selected = true;

    this.setState({ filter, sliderValue: values });

    const minOption = this.state.filter.options[values[0]];
    const maxOption = this.state.filter.options[values[1]];
    this.setState({
      minValue: minOption.label,
      maxValue: maxOption.label
    });

    this.props.onFilterChange &&
      this.props.onFilterChange(
        this.props.filter.id,
        `${minOption.value}_${maxOption.value}`
      );
  };

  render() {
    return (
      <Container>
        <Label>{this.state.filter.label}</Label>
        <SliderContainer>
          <Range
            value={this.state.sliderValue}
            min={0}
            max={this.state.filter.options.length - 1}
            railStyle={railStyle}
            handleStyle={[handleStyle, handleStyle]}
            trackStyle={[trackStyle, trackStyle]}
            onChange={this.onChange}
          />
          <DataMin>{this.state.minValue}</DataMin>
          <DataMax>{this.state.maxValue}</DataMax>
        </SliderContainer>
      </Container>
    );
  }
}

const Container = emotion('div')({
  marginBottom: '20px',
  textAlign: 'left',
  fontSize: '15px',
  boxSizing: 'border-box',
  fontFamily: 'Calibri'
});

const Label = emotion('label')({
  fontSize: '1.25em',
  borderBottom: '1px solid #CCC',
  fontWeight: 'bold',
  width: '100%',
  display: 'block'
});

const SliderContainer = emotion('div')({
  position: 'relative',
  margin: '20px auto 70px'
});

const Data = emotion('div')({
  position: 'absolute',
  width: '60px',
  height: '20px',
  lineHeight: '20px',
  fontSize: '12px',
  background: 'rgb(86, 86, 86)',
  color: '#CCC',
  textAlign: 'center',
  border: '1px solid rgb(74, 74, 74)',
  top: '30px',
  boxSizing: 'border-box'
});

const DataMin = emotion(Data)({
  left: 0
});

const DataMax = emotion(Data)({
  right: 0
});
