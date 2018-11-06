import * as React from 'react';
import emotion from 'react-emotion';

interface Props {
  onClick(item?: any): void;
  height?: string;
  width?: string;
  title?: string;
}

const ButtonIcon = ({ onClick, height, width, ...rest }: Props) => (
  <Container height={height} width={width} onClick={onClick} {...rest} />
);

const Container = emotion('div')(
  {
    marginRight: '10px',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.9
    },
    '& *': {
      margin: '0 auto',
      textAlign: 'center'
    }
  },
  ({ height, width }: any) => ({
    height: height ? height : '',
    width: width ? width : ''
  })
);

export default ButtonIcon;
