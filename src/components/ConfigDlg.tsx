import * as React from 'react';
import Modal from './Modal';
import {
  VerticalLayout,
  RowReverseLayout
} from '../components/SharedComponents';
import TextInput from './TextInput';
import TagInput from './TagInput';
import { getTags } from '../services/Storage';
import Config from '../Models/Config';
import Component from '../Models/Component';
import emotion from 'react-emotion';

import EditableComponentsList from './EditableComponentsList';
import GroupCard from './Configurateur/GroupCard';

interface Props {
  mode: 'editable' | 'post';
  open: boolean;
  config: Config;
  submitButtonTitle?: string;
  title: string;
  onClose(): void;
  onConfirmConfig(config: Config): void;
  onCopyConfig?(): void;
  onConfigChange?(config: Config): void;
  onDeleteItem?(name: string): void;
  renderFooter?(): JSX.Element;
}

interface State {
  config: Config;
  configCopied: boolean;
}

export default class ConfigDlg extends React.Component<Props, State> {
  state = {
    config: this.props.config,
    configCopied: false
  };

  onSubjectIdConfigChange = (id: string): void => {
    this.state.config.subjectId = id;
    this.setState({ configCopied: false });
  };

  onOwnerConfigChange = (owner: string): void => {
    this.state.config.owner = owner;
    this.setState({ configCopied: false });
  };

  onConfigTagsChange = (tags: string[]): void => {
    this.state.config.tags = tags;
    this.setState({ configCopied: false });
  };

  onDeleteComponent = (id: string): void => {
    let config = this.state.config;
    config.components = config.components.filter(
      component => component.id !== id
    );

    this.setState({ config, configCopied: false });
  };

  onConfirmConfig = (): void => {
    this.props.onConfirmConfig(this.state.config);
    this.setState({ configCopied: false });
  };

  onComponentChange = (editedComponent: Component): void => {
    let config = this.state.config;
    config.components = config.components.map(component => {
      if (component.name === name) {
        return editedComponent;
      }
      return component;
    });

    this.setState({ config, configCopied: false });
  };

  render() {
    if (!this.props.open) return null;

    const { submitButtonTitle, title } = this.props;
    const { config } = this.state;
    return (
      <Modal
        title={title}
        submitButtonTitle={submitButtonTitle || 'Confirmer'}
        onConfirm={this.onConfirmConfig}
        {...this.props}>
        {this.props.mode === 'editable' && (
          <GroupCard title="Informations">
            <VerticalLayout>
              <Input
                label="Id du sujet:"
                value={config.subjectId}
                onChange={this.onSubjectIdConfigChange}
              />
              <Input
                label="Membre:"
                value={config.owner}
                onChange={this.onOwnerConfigChange}
              />
              <TagInput
                getTags={getTags}
                value={config.tags}
                onChange={this.onConfigTagsChange}
              />
            </VerticalLayout>
          </GroupCard>
        )}
        <GroupCard title="Les composants">
          <EditableComponentsList
            components={config.components}
            onDeleteComponent={this.onDeleteComponent}
            onComponentChange={this.onComponentChange}
          />
        </GroupCard>
        <RowReverseLayout>
          <TitleH3>
            Prix total:{' '}
            {`${new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: config.monnaie
            }).format(config.price)}`}
          </TitleH3>
        </RowReverseLayout>
        {config.refund !== 0 && (
          <RowReverseLayout>
            <TitleH4>
              Remise:{' '}
              {`${new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: config.monnaie
              }).format(config.refund)}`}
            </TitleH4>
          </RowReverseLayout>
        )}
      </Modal>
    );
  }
}

const Input = emotion(TextInput)({});

const TitleH2 = emotion('h2')({
  fontSize: '23px',
  fontWeight: 500,
  color: '#e61f1f',
  marginBottom: '15px'
});

const TitleH3 = emotion('h3')({
  fontSize: '21px',
  fontWeight: 500
});

const TitleH4 = emotion('h4')({
  fontSize: '18px',
  fontWeight: 400
});
