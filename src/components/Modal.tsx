import * as React from 'react';
import emotion from 'react-emotion';
import ButtonIcon from './ButtonIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Rnd } from 'react-rnd';
import {
  HorizontalLayout,
  RowReverseLayout,
  Button,
  SubmitButton,
  CancelButton
} from './SharedComponents';

interface Props {
  height?: number;
  width?: number;
  title: string;
  onClose(): void;
  onConfirm(): void;
  renderFooter?(): JSX.Element;
  submitButtonTitle?: string;
  cancelButtonTitle?: string;
  open: boolean;
}

export default class Modal extends React.Component<Props> {
  onClose = (): void => {
    this.props.onClose && this.props.onClose();
  };

  onConfirm = (): void => {
    this.props.onConfirm && this.props.onConfirm();
  };

  render() {
    if (!this.props.open) {
      return null;
    }

    const {
      title,
      width,
      height,
      renderFooter,
      cancelButtonTitle,
      submitButtonTitle,
      children
    } = this.props;

    return (
      <Overlay>
        <Window
          minWidth={300}
          minHeight={300}
          cancel=".cancel-drag-content-window"
          default={{
            x: (window.innerWidth - (width || 800)) / 2,
            y: (window.innerHeight - (height || 800)) / 2,
            width: width || 800,
            height: height || 800
          }}>
          <Header>
            <Title>{title}</Title>
            <ButtonIcon onClick={this.onClose}>
              <CloseIcon icon={faTimes} />
            </ButtonIcon>
          </Header>
          <Content className="cancel-drag-content-window">{children}</Content>
          <ButtonContainer>
            <HorizontalLayout>
              {renderFooter && renderFooter()}
            </HorizontalLayout>
            <RowReverseLayout>
              <SubmitButton
                onClick={this.onConfirm}
                title={submitButtonTitle || 'Confirmer'}
              />
              <CancelButton
                onClick={this.onClose}
                title={cancelButtonTitle || 'Annuler'}
              />
            </RowReverseLayout>
          </ButtonContainer>
        </Window>
      </Overlay>
    );
  }
}

// const SubmitButton = emotion(Button)({
//   backgroundColor: '#1c7eb5'
// });

// const CancelButton = emotion(Button)({
//   backgroundColor: '#e61f1f'
// });

const Title = emotion('span')({
  paddingLeft: '10px'
});

const CloseIcon = emotion(FontAwesomeIcon)({
  fontSize: '1.2em',
  color: '#FFF'
});

const Header = emotion('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '40px',
  backgroundColor: '#272e3f',
  color: '#FFF',
  fontSize: '1.2em',
  borderRadius: '5px 5px 0px 0px'
});

const Overlay = emotion('div')({
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.3)',
  padding: 50,
  zIndex: 10000
});

const Window = emotion(Rnd)({
  fontFamily: 'Lato, Arial, Helvetica Neue, Helvetica, sans-serif!important',
  textTransform: 'none',
  fontSize: '15px',
  backgroundColor: '#181818',
  borderRadius: 5,
  color: '#676767'
});

const Content = emotion('div')({
  position: 'absolute',
  top: '40px',
  left: 0,
  right: 0,
  bottom: '50px',
  padding: '20px',
  overflow: 'auto',
  '&:hover': {
    cursor: 'default'
  }
});

const ButtonContainer = emotion('div')({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '50px',
  backgroundColor: '#272e3f',
  borderRadius: '0px 0px 5px 5px'
});
