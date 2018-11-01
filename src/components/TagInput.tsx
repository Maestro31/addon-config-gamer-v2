import * as React from 'react';
import Creatable from 'react-select/lib/Creatable';
import emotion from 'react-emotion';

interface Tag {
  label: string;
  value: string;
}

interface Props {
  value?: string[];
  getTags?(): Promise<string[]>;
  onChange?(value: string[]): void;
  styles?: any;
}

interface State {
  tags: Tag[];
  value: Tag[];
}

const customStyles = {
  input: base => ({
    ...base,
    height: '25px',
    lineHeight: '25px'
  }),
  container: base => ({
    ...base,
    marginBottom: '15px'
  })
};

export default class TagInput extends React.Component<Props, State> {
  state = {
    tags: [],
    value: []
  };

  private createOption = (label: string): Tag => ({
    label,
    value: label.toLowerCase().replace(/\W/g, '')
  });

  componentDidMount = () => {
    this.props.getTags().then(tags => {
      this.setState({ tags: tags.map(tag => this.createOption(tag)) });
    });

    this.props.value &&
      this.setState({
        value: this.props.value.map(option => this.createOption(option))
      });
  };

  onChange = value => {
    this.setState({ value });
    this.props.onChange(value.map(v => v.label));
  };

  render() {
    return (
      <Select
        placeholder="Tags..."
        options={this.state.tags}
        isClearable={true}
        isMulti={true}
        onChange={this.onChange}
        value={this.state.value}
        styles={customStyles}
      />
    );
  }
}

const Select = emotion(Creatable)({
  '& #react-select-2-input': {
    height: '25px',
    lineHeight: '25px'
  }
});
