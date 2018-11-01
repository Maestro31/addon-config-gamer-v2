import * as React from 'react';
import emotion from 'react-emotion';

interface Props {
  currentIndex: number;
  pageCount: number;
  onIndexChange?(index: number): void;
}

export default class Pagination extends React.Component<Props> {
  onIndexChange = (index: number): void => {
    if (index === this.props.currentIndex) return;
    this.props.onIndexChange && this.props.onIndexChange(index);
    console.log(index);
  };

  createChild = (index: number, text?: string): JSX.Element => {
    return (
      <Item
        key={text || index}
        active={index === this.props.currentIndex}
        onClick={() => this.onIndexChange(index)}>
        {text || index}
      </Item>
    );
  };

  createList = () => {
    let children = [];
    const { currentIndex, pageCount } = this.props;

    if (currentIndex > 1) {
      const previousIndex = currentIndex - 10 > 0 ? currentIndex - 10 : 1;
      children.push(this.createChild(previousIndex, '<'));
    }

    if (currentIndex !== 1) children.push(this.createChild(1));

    for (let i = currentIndex; i < currentIndex + 5 && i < pageCount; i++) {
      children.push(this.createChild(i));
    }

    if (currentIndex === pageCount && pageCount > 5)
      children.push(this.createChild(pageCount - 1));

    children.push(this.createChild(pageCount));

    if (pageCount - currentIndex > 10) {
      children.push(this.createChild(currentIndex + 10, '>'));
    }
    return children;
  };

  render() {
    if (!this.props.pageCount || this.props.pageCount <= 1) return null;

    return <List>{this.createList()}</List>;
  }
}

const List = emotion('ul')({
  display: 'flex',
  flexDirection: 'row',
  listStyle: 'none',
  padding: 0
});

const Item = emotion('li')(
  {
    display: 'block',
    height: '34px',
    width: '34px',
    lineHeight: '34px',
    textAlign: 'center',
    marginLeft: '2px',
    backgroundColor: '#333333',
    cursor: 'pointer',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#565656'
    }
  },
  ({ active }: any) => ({
    backgroundColor: active ? '#4275BB' : '#333333'
  })
);
