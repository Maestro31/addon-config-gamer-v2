import * as React from 'react';
import emotion from 'react-emotion';
import * as DOM from 'react-dom';
import Menu from '../components/Menu';
import ParserService from '../services/Parsers/Parser';
import ConfigDlg from '../components/ConfigDlg';
import { saveConfigMessage, sendMessage } from '../services/Messages';
import SetupPC from '../Models/SetupPC';
import { copyConfigMessage } from '../services/Messages';
import { Button } from '../components/SharedComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import chrome from '../services/Browser';

interface State {
  openConfigDlg: boolean;
  config: SetupPC;
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
        const config = ParserService.parseSetupPC();
        console.log(config);
        sendResponse(config);
      }
    });
  };

  onSaveConfigClick = () => {
    const config = ParserService.parseSetupPC();
    this.setState({ config, openConfigDlg: true, configCopied: false });
  };

  onSettingsClick = () => {
    sendMessage('open_options');
  };

  onCloseModal = () => {
    this.setState({ openConfigDlg: false, config: null, configCopied: false });
  };

  onConfirmModal = (config: SetupPC) => {
    this.onCloseModal();
    saveConfigMessage(config);
  };

  onCopyConfig = () => {
    this.setState({ configCopied: true });
    copyConfigMessage(this.state.config);
  };

  onConfigChange = (config: SetupPC) => {
    this.setState({ config });
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
            onConfigChange={this.onConfigChange}
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
