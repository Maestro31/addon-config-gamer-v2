import * as React from 'react';
import emotion from 'react-emotion';
import { Keyframes, animated } from 'react-spring';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import delay from 'delay';
import chrome from '../../services/Browser';

const MenuBar = Keyframes.Spring({
  open: { x: 110 },
  close: async call => {
    await delay(400);
    await call({ x: 50 });
  }
});

interface Props {
  onSaveConfigClick: () => void;
}

interface State {
  open: boolean;
}

export default class Menu extends React.Component<Props, State> {
  state = {
    open: false
  };

  openMenu = (e: React.MouseEvent): void => {
    this.setState({ open: true });
  };

  closeMenu = (e: React.MouseEvent): void => {
    this.setState({ open: false });
  };

  render() {
    const state = this.state.open ? 'open' : 'close';
    return (
      <Container onMouseOver={this.openMenu} onMouseLeave={this.closeMenu}>
        <MenuBar native state={state}>
          {({ x }) => (
            <MenuContainer
              style={{
                width: x.interpolate(x => `${x}px`)
              }}>
              <ContentMenu>
                <MenuIcon src={chrome.runtime.getURL('/img/icon48.png')} />
                <Button onClick={this.props.onSaveConfigClick}>
                  <FontAwesomeIcon icon={faDownload} />
                </Button>
              </ContentMenu>
            </MenuContainer>
          )}
        </MenuBar>
      </Container>
    );
  }
}

const Container = emotion('div')({
  position: 'fixed',
  left: '15px',
  top: '15px',
  zIndex: 10000
});

const MenuIcon = emotion('img')({
  width: '35px',
  height: '35px',
  margin: '0 7px'
});

const Button = emotion('div')({
  boxSizing: 'border-box',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  marginLeft: '10px',
  fontSize: '30px',
  opacity: 0.9,
  color: '#FFF',
  '&:hover': {
    opacity: 1
  }
});

const ContentMenu = emotion('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  position: 'absolute',
  height: '100%',
  top: 0,
  left: 0
});

const MenuContainer = emotion(animated.div)({
  height: '50px',
  position: 'absolute',
  top: 0,
  left: 0,
  boxSizing: 'border-box',
  background: '#3b3a3a',
  overflow: 'hidden',
  borderRadius: '35px'
});
