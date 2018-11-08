import * as React from 'react';
import emotion from 'react-emotion';

interface Props {
  value?: string;
  onChange?(value: string): void;
  label?: string;
  placeholder?: string;
}

interface State {
  value: string;
}

export default class TextInput extends React.Component<Props, State> {
  state = {
    value: this.props.value || ''
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ value: e.target.value });
    this.props.onChange(e.target.value);
  };

  render = (): JSX.Element => {
    const { label, placeholder } = this.props;
    return (
      <Container>
        {label && <label>{label}</label>}
        <input
          type="text"
          onChange={this.onChange}
          value={this.state.value}
          placeholder={placeholder}
        />
      </Container>
    );
  };
}

const Container = emotion('div')({
  display: 'flex',
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 0,
  boxSizing: 'border-box',
  '& input': {
    width: '100%',
    height: '25px',
    borderRadius: '2px',
    border: '1px solid gray',
    fontSize: '15px',
    lineHeight: '25px',
    fontWeight: 400,
    padding: '2px 10px'
  },
  '& label': {
    display: 'block',
    width: '150px',
    textAlign: 'right',
    margin: '0px 10px 0px 0px',
    fontWeight: 400
  }
});
