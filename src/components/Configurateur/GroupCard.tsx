import * as React from 'react';
import emotion from 'react-emotion';

interface Props {
  title: string;
  gridArea?: string;
}

export default class GroupCard extends React.Component<Props> {
  render() {
    return (
      <Container>
        <Title>{this.props.title}</Title>
        <SectionComponents>{this.props.children}</SectionComponents>
      </Container>
    );
  }
}

const Container = emotion('div')(
  {
    backgroundColor: '#2a2a2a',
    fontFamily: 'Calibri',
    color: '#A7A7A7',
    padding: '15px',
    boxShadow: 'rgba(0,0,0,0.1) 1px 2px 5px',
    marginBottom: '10px'
  },
  ({ gridArea }: any) => ({
    gridArea
  })
);

const Title = emotion('h3')({
  padding: '0 10px',
  fontSize: '1.9em',
  lineHeight: '39px',
  textAlign: 'center',
  position: 'relative',
  margin: '0 auto 20px',
  borderBottom: '1px solid #A7A7A7',
  color: '#A7A7A7'
});

const SectionComponents = emotion('div')({
  lineHeight: '1.5'
});
