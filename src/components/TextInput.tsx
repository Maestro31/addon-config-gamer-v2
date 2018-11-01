import * as React from 'react';
import emotion from 'react-emotion';

interface Props {
  value?: string;
  onChange?(value: string): void;
  label?: string;
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
    const { label } = this.props;
    return (
      <Container>
        {label && <label>{label}</label>}
        <input type="text" onChange={this.onChange} value={this.state.value} />
      </Container>
    );
  };
}

const Container = emotion('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  margin: '5px 0px',
  '& input': {
    width: '150px',
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
    width: '80px',
    margin: '0px',
    fontWeight: 400
  }
});
