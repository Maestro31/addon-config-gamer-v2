import * as React from 'react';
import * as DOM from 'react-dom';
import chrome from '../services/Browser';
import Config from '../Models/Config';
import ConfigDlg from '../components/ConfigDlg';
import { postConfig } from '../services/PostConfig';

interface State {
  config: Config;
  openConfigDlg: boolean;
  message: string;
  messageIntro: string;
}

export default class ConfigGamer extends React.Component<{}, State> {
  state = {
    config: null,
    openConfigDlg: false,
    message: '',
    messageIntro: ''
  };
  componentDidMount() {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (
        msg.command &&
        msg.command === 'post_config' &&
        msg.config !== undefined
      ) {
        this.setState({
          config: Config.create(msg.config),
          openConfigDlg: true
        });
        sendResponse(true);
      } else {
        alert('Aucune config copiée');
      }
    });
  }

  onConfirmModal = (): void => {
    this.onCloseModal();
    postConfig(this.state.config, this.state.messageIntro, this.state.message);
  };

  onCloseModal = (): void => {
    this.setState({ openConfigDlg: false, config: null });
  };

  onConfigChange = (config: Config): void => {
    this.setState({ config });
  };

  render() {
    return (
      <>
        {this.state.config && (
          <ConfigDlg
            mode="post"
            title="Poster config"
            submitButtonTitle="Poster"
            config={this.state.config}
            open={this.state.openConfigDlg}
            onConfirmConfig={this.onConfirmModal}
            onClose={this.onCloseModal}
            onConfigChange={this.onConfigChange}
            onMessageChange={message => this.setState({ message })}
            onMessageIntroChange={messageIntro =>
              this.setState({ messageIntro })
            }
          />
        )}
      </>
    );
  }
}

let root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);

DOM.render(<ConfigGamer />, document.getElementById('root'));
