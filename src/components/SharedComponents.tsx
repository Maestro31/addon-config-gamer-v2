import * as React from 'react';
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
  //height: '20px',
  minWidth: '80px',
  width: 'auto',
  borderRadius: '0.2em',
  padding: '5px',
  color: 'white',
  marginRight: '10px',
  textAlign: 'center',
  lineHeight: '20px',
  fontSize: '1em',
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.9
  }
});

const PrimaryButton = emotion(Button)({
  backgroundColor: '#1c7eb5'
});

const AlertButton = emotion(Button)({
  backgroundColor: '#e61f1f'
});

export const CancelButton = ({ title, onClick, ...props }) => (
  <AlertButton onClick={onClick} {...props}>
    {title}
  </AlertButton>
);

export const SubmitButton = ({ title, onClick, ...props }) => (
  <PrimaryButton onClick={onClick} {...props}>
    {title}
  </PrimaryButton>
);

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
