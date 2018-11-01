import * as React from 'react';
import emotion from 'react-emotion';
import ButtonIcon from '../components/ButtonIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import chrome from '../services/Browser';

interface Props {
  onSaveConfigClick(): void;
}

export default class MenuBar extends React.Component<Props> {
  openDashboard = () => {
    chrome.runtime.sendMessage({ command: 'open_dashboard' });
  };

  render() {
    return (
      <Container>
        <ButtonIcon height="90%" onClick={this.openDashboard}>
          <img
            src={chrome.runtime.getURL('/img/icon48.png')}
            width="32px"
            title="Dashboard"
          />
        </ButtonIcon>
        <ButtonIcon
          height="90%"
          title="Sauvegarder config"
          onClick={this.props.onSaveConfigClick}>
          <SmallIcon icon={faDownload} />
        </ButtonIcon>
      </Container>
    );
  }
}

const Container = emotion('div')({
  position: 'fixed',
  left: '0px',
  right: '0px',
  top: '0px',
  height: '20px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#141c31',
  opacity: 0,
  transition: 'height 250ms ease',
  zIndex: 10000,
  '&:hover': {
    height: '40px',
    opacity: 1
  }
});

const SmallIcon = emotion(FontAwesomeIcon)({
  fontSize: '2em',
  color: '#FFF'
});
