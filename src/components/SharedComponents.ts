import emotion from 'react-emotion';

export const VerticalLayout = emotion('div')({
  display: 'flex',
  flexDirection: 'column'
});

export const HorizontalLayout = emotion('div')({
  display: 'flex',
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center'
});

export const RowReverseLayout = emotion('div')({
  display: 'flex',
  flex: 1,
  flexDirection: 'row-reverse',
  alignItems: 'center'
});

export const Button = emotion('div')({
  borderRadius: '0.2em',
  padding: '5px',
  color: 'white',
  marginRight: '10px',
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.9
  }
});

export const DispoView = emotion('div')(
  {
    borderRadius: '100%',
    width: '20px',
    height: '20px'
  },
  ({ isDispo }: any) => ({
    backgroundColor: isDispo ? 'green' : 'red'
  })
);

export const Link = emotion('a')({
  textDecoration: 'none',
  color: 'inherit',
  cursor: 'pointer',
  '&:hover': {
    color: '#FFF'
  }
});
