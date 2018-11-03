import * as React from 'react';
import Modal from './Modal';
import {
  VerticalLayout,
  RowReverseLayout
} from '../components/SharedComponents';
import TextInput from './TextInput';
import TagInput from './TagInput';
import { getTags, getComments } from '../services/Storage';
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
  onMessageChange?: (text: string) => void;
  onConfirmConfig(config: Config): void;
  onCopyConfig?(): void;
  onConfigChange?(config: Config): void;
  onDeleteItem?(name: string): void;
  renderFooter?(): JSX.Element;
}

interface State {
  config: Config;
  configCopied: boolean;
  message: string;
}

export default class ConfigDlg extends React.Component<Props, State> {
  state: State = {
    config: this.props.config,
    configCopied: false,
    message: ''
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

  onConfigUrlChange = (url: string) => {
    this.state.config.url = url;
    this.setState({ configCopied: false });
  };

  onMessageChange = e => {
    this.setState({ message: e.target.value });
    this.props.onMessageChange && this.props.onMessageChange(e.target.value);
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
        height={950}
        width={900}
        submitButtonTitle={submitButtonTitle || 'Confirmer'}
        onConfirm={this.onConfirmConfig}
        {...this.props}>
        <GroupCard title="Informations">
          <VerticalLayout>
            {this.props.mode === 'editable' ? (
              <>
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
              </>
            ) : (
              <LinkInput
                label="Lien vers la config:"
                value={config.url}
                onChange={this.onConfigUrlChange}
              />
            )}
          </VerticalLayout>
        </GroupCard>
        <GroupCard title="Les composants">
          <EditableComponentsList
            components={config.components}
            activeComment={this.props.mode === 'post'}
            onDeleteComponent={this.onDeleteComponent}
            onComponentChange={this.onComponentChange}
          />
        </GroupCard>
        <RowReverseLayout>
          <PriceText>
            Prix total:{' '}
            {`${new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: config.currency
            }).format(config.price)}`}
          </PriceText>
        </RowReverseLayout>
        {config.refund !== 0 && (
          <RowReverseLayout>
            <TitleH4>
              Remise:{' '}
              {`${new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: config.currency
              }).format(config.refund)}`}
            </TitleH4>
          </RowReverseLayout>
        )}
        {this.props.mode === 'post' && (
          <>
            <Label>Message:</Label>
            <TextArea
              value={this.state.message}
              onChange={this.onMessageChange}
            />
          </>
        )}
      </Modal>
    );
  }
}

const Input = emotion(TextInput)({});

const PriceText = emotion('h3')({
  fontSize: '21px',
  fontWeight: 500,
  color: '#D7D7D7'
});

const TitleH4 = emotion('h4')({
  fontSize: '18px',
  fontWeight: 400,
  marginTop: 0,
  marginBottom: '5px'
});

const TextArea = emotion('textarea')({
  width: '100%',
  boxSizing: 'border-box',
  height: '150px'
});

const Label = emotion('label')({
  fontSize: '15px'
});

const LinkInput = emotion(Input)({
  width: '100%'
});
