import * as React from 'react';
import * as DOM from 'react-dom';
import ConfigTable from './components/ConfigTable';
import ConfigDlg from './components/ConfigDlg';
import SearchDlg from './components/SearchComponent/SearchDlg';
import { getConfigs, setConfigs } from './services/Storage';
import { copyConfigMessage } from './services/Message';
import Parser from './services/Parsers/Parser';
import Config from './Models/Config';
import ButtonIcon from './components/ButtonIcon';

interface State {
  openModal: boolean;
  configs: Config[];
  openConfigDlg: boolean;
  openSearchDlg: boolean;
  config: Config;
}

export default class Dashboard extends React.Component<{}, State> {
  constructor(props?) {
    super(props);
  }

  state: State = {
    openModal: false,
    configs: null,
    openConfigDlg: false,
    openSearchDlg: false,
    config: null
  };

  async componentWillMount() {
    this.setState({ configs: await getConfigs() });
  }

  onPressDeleteItem = (id: string): void => {
    if (window.confirm('La suppression est définitive.\nContinuer ?')) {
      const configs = this.state.configs.filter(config => config.id !== id);
      setConfigs(configs);
      this.setState({ configs });
    }
  };

  onPressEditItem = config => {
    this.setState({ config, openConfigDlg: true });
  };

  onPressUpdateItem = config => {
    Parser.updateConfig(config, (updatedConfig, comparison) => {
      const configs = this.state.configs.map(
        config => (config.id === updatedConfig.id ? updatedConfig : config)
      );
      this.setState({ configs });
      setConfigs(configs);
    });
  };

  onConfirmEditConfig = () => {
    const configs = this.state.configs.map(config => {
      if (config.id === this.state.config.id) {
        this.state.config.modificationDate = new Date();
        return this.state.config;
      } else {
        return config;
      }
    });

    setConfigs(configs);
    this.setState({ openConfigDlg: false, config: null, configs });
  };

  onCloseConfigModal = (): void => {
    this.setState({ openConfigDlg: false });
  };

  onConfigChange = (config: Config): void => {
    this.setState({ config });
  };

  onCopyConfig = (): void => {
    console.log(this.state.config);
    copyConfigMessage(this.state.config);
  };

  onOpenSearchDlg = (): void => {
    this.setState({ openSearchDlg: true });
  };

  onCloseSearchDlg = (): void => {
    this.setState({ openSearchDlg: false });
  };

  onConfirmSearchDlg = (): void => {
    this.setState({ openSearchDlg: false });
  };

  render() {
    return (
      <div>
        <ConfigTable
          configs={this.state.configs}
          onPressUpdateItem={this.onPressUpdateItem}
          onPressEditItem={this.onPressEditItem}
          onPressDeleteItem={this.onPressDeleteItem}
        />
        <ButtonIcon onClick={this.onOpenSearchDlg}>Test de bouton</ButtonIcon>
        {this.state.config && (
          <ConfigDlg
            mode="editable"
            title={`Config de ${this.state.config && this.state.config.owner}`}
            submitButtonTitle="Modifier"
            config={this.state.config}
            open={this.state.openConfigDlg}
            onConfirmConfig={this.onConfirmEditConfig}
            onClose={this.onCloseConfigModal}
            onConfigChange={this.onConfigChange}
            onCopyConfig={this.onCopyConfig}
          />
        )}
        <SearchDlg
          open={this.state.openSearchDlg}
          onClose={this.onCloseSearchDlg}
          onConfirm={this.onConfirmSearchDlg}
        />
      </div>
    );
  }
}

DOM.render(<Dashboard />, document.getElementById('root'));
