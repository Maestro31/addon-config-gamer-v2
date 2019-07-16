import * as React from 'react';
import emotion from 'react-emotion';

interface Props {
  onClick(item?: any): void;
  height?: string;
  width?: string;
  title?: string;
  children?: any
}

const ButtonIcon = ({ onClick, height, title, width, ...rest }: Props) => (
  <Container height={height} width={width} onClick={onClick} {...rest} />
);

const Container = emotion('div')(
  {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '10px',
    cursor: 'pointer',
    textAlign: 'center',
    boxSizing: 'border-box',
    '& *': {
      margin: '0 auto'
    }
  },
  ({ height, width }: any) => ({
    height: height ? height : 'auto',
    width: width ? width : 'auto',
    lineHeight: height ? height : ''
  })
);

export default ButtonIcon;
