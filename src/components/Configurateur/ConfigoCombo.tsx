import * as React from 'react';
import emotion from 'react-emotion';

interface Props {
  title: string;
  icon: string;
}

export default class ConfigoCombo extends React.Component<Props> {
  render() {
    return (
      <Container>
        <FlexContainer>
          <Icon src={this.props.icon} alt="" />
          <Title>{this.props.title}</Title>
        </FlexContainer>
        <AddIcon>{'+'}</AddIcon>
      </Container>
    );
  }
}

const Icon = emotion('img')({
  width: '30px',
  height: '25px',
  marginRight: '10px',
  padding: '3px 0',
  display: 'inline-block',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center'
});

const Container = emotion('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '40px',
  padding: '0.2em',
  cursor: 'pointer',
  maxWidth: '650px',
  position: 'relative',
  borderRadius: '3px',
  border: '1px solid #A7A7A7',
  boxSizing: 'border-box',
  marginBottom: '20px'
});

const FlexContainer = emotion('div')({
  display: 'flex',
  alignItems: 'center'
});

const Title = emotion('div')({
  margin: '2px'
});

const AddIcon = emotion('span')({
  margin: '4px 5px',
  fontSize: '1.5em',
  color: '#565656',
  textAlign: 'center',
  display: 'inline-block'
});
