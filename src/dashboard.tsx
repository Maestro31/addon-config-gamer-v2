import * as React from 'react';
import * as DOM from 'react-dom';
import CartTable from './components/CartTable';
import CartDialog from './components/PostCartDialog';
import { getCarts, setCarts } from './services/Storage';
import { copyCartMessage } from './services/Messages';
import ScrapperService from './services/Scrappers';
import Cart from './Models/Cart';

interface State {
  openModal: boolean;
  configs: Cart[];
  openConfigDlg: boolean;
  openSearchDlg: boolean;
  config: Cart;
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
    this.setState({ configs: await getCarts() });
  }

  onPressDeleteItem = (id: string): void => {
    if (window.confirm('La suppression est définitive.\nContinuer ?')) {
      const configs = this.state.configs.filter(config => config.id !== id);
      setCarts(configs);
      this.setState({ configs });
    }
  };

  onPressEditItem = config => {
    this.setState({ config, openConfigDlg: true });
  };

  onPressUpdateItem = async config => {
    const updatedConfig = await ScrapperService.updateCart(config);
    const configs = this.state.configs.map(config =>
      config.id === updatedConfig.id ? updatedConfig : config
    );

    this.setState({ configs });
    setCarts(configs);
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

    setCarts(configs);
    this.setState({ openConfigDlg: false, config: null, configs });
  };

  onCloseConfigModal = (): void => {
    this.setState({ openConfigDlg: false });
  };

  onConfigChange = (config: Cart): void => {
    this.setState({ config });
  };

  onCopyConfig = (): void => {
    console.log(this.state.config);
    copyCartMessage(this.state.config);
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
        <CartTable
          carts={this.state.configs}
          onPressUpdateItem={this.onPressUpdateItem}
          onPressEditItem={this.onPressEditItem}
          onPressDeleteItem={this.onPressDeleteItem}
        />
        {/* <ButtonIcon onClick={this.onOpenSearchDlg}>Test de bouton</ButtonIcon> */}
        {/* {this.state.config && (
          <CartDialog
            mode="editable"
            title={`Config de ${this.state.config && this.state.config.owner}`}
            submitButtonTitle="Modifier"
            cart={this.state.config}
            open={this.state.openConfigDlg}
            onConfirmCart={this.onConfirmEditConfig}
            onClose={this.onCloseConfigModal}
            onCartChange={this.onConfigChange}
            onCopyCart={this.onCopyConfig}
          />
        )} */}
        {/* <SearchDlg
          open={this.state.openSearchDlg}
          onClose={this.onCloseSearchDlg}
          onConfirm={this.onConfirmSearchDlg}
        /> */}
      </div>
    );
  }
}

DOM.render(<Dashboard />, document.getElementById('root'));
