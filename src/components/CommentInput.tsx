import * as React from 'react';
import Creatable from 'react-select/lib/Creatable';
import emotion from 'react-emotion';

interface Comment {
  label: string;
  value: string;
}

interface Props {
  comments: string[];
  value?: Comment;
  onChange?: (value: string) => void;
  onCreateOption?: (value: string) => void;
  styles?: any;
}

interface State {
  value: Comment;
}

const customStyles = {
  input: base => ({
    ...base,
    height: '25px',
    lineHeight: '25px'
  })
};

export default class TagInput extends React.Component<Props, State> {
  state: State = {
    value: undefined
  };

  private createOption = (label: string): Comment => ({
    label,
    value: label.toLowerCase().replace(/\W/g, '')
  });

  onChange = value => {
    this.setState({ value });
    this.props.onChange(value.label);
  };

  onCreateOption = value => {
    this.setState({ value: this.createOption(value) });
    this.props.onCreateOption && this.props.onCreateOption(value);
  };

  render() {
    const comments = this.props.comments.map(c => this.createOption(c));

    return (
      <Select
        placeholder="Commentaire..."
        options={comments}
        isClearable={true}
        isMulti={false}
        isSearchable={true}
        onChange={this.onChange}
        onCreateOption={this.onCreateOption}
        value={this.state.value}
        styles={customStyles}
      />
    );
  }
}

const Select = emotion(Creatable)({
  color: '#444',
  '& #react-select-2-input': {
    height: '25px',
    lineHeight: '25px',
    width: '100%'
  }
});
