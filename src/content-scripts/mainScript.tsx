import * as React from 'react';
import emotion from 'react-emotion';
import * as DOM from 'react-dom';
import Menu from '../components/Menu';
import Parser from '../services/Parsers/Parser';
import ConfigDlg from '../components/ConfigDlg';
import { saveConfigMessage, sendMessage } from '../services/Messages';
import Config from '../Models/Config';
import { copyConfigMessage } from '../services/Messages';
import { Button } from '../components/SharedComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import chrome from '../services/Browser';

interface State {
  openConfigDlg: boolean;
  config: Config;
  configCopied: boolean;
}

export default class Main extends React.Component<{}, State> {
  state: State = {
    openConfigDlg: false,
    config: null,
    configCopied: false
  };

  componentWillMount = () => {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg && msg.command === 'copy_config') {
        const config = Parser.parseConfig();
        sendResponse(config);
      }
    });
  };

  onSaveConfigClick = () => {
    const config = Parser.parseConfig();
    this.setState({ config, openConfigDlg: true, configCopied: false });
  };

  onSettingsClick = () => {
    sendMessage('open_options');
  };

  onCloseModal = () => {
    this.setState({ openConfigDlg: false, config: null, configCopied: false });
  };

  onConfirmModal = (config: Config) => {
    this.onCloseModal();
    saveConfigMessage(config);
  };

  onCopyConfig = () => {
    this.setState({ configCopied: true });
    copyConfigMessage(this.state.config);
  };

  render() {
    return (
      <>
        <Menu
          onSaveConfigClick={this.onSaveConfigClick}
          onSettingsClick={this.onSettingsClick}
        />
        {this.state.config && (
          <ConfigDlg
            mode="editable"
            title="Nouvelle config"
            submitButtonTitle="Sauvegarder"
            config={this.state.config}
            open={this.state.openConfigDlg}
            onConfirmConfig={this.onConfirmModal}
            onClose={this.onCloseModal}
            renderFooter={() => (
              <CopyButton onClick={this.onCopyConfig}>
                Copier config
                {this.state.configCopied && <CheckIcon icon={faCheck} />}
              </CopyButton>
            )}
          />
        )}
      </>
    );
  }
}

const CopyButton = emotion(Button)({
  backgroundColor: '#1c7eb5',
  marginLeft: '10px'
});

const CheckIcon = emotion(FontAwesomeIcon)({
  marginLeft: '5px'
});

let root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);

DOM.render(<Main />, document.getElementById('root'));
