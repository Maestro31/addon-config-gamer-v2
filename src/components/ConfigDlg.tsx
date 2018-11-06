import * as React from 'react';
import Modal from './Modal';
import {
  VerticalLayout,
  RowReverseLayout,
  HorizontalLayout
} from '../components/SharedComponents';
import TextInput from './TextInput';
import TagInput from './TagInput';
import { getTags } from '../services/Storage';
import SetupPC from '../Models/SetupPC';
import ComponentPC from '../Models/ComponentPC';
import emotion from 'react-emotion';
import * as NumericInput from 'react-numeric-input';
import EditableComponentsList from './EditableComponentsList';
import GroupCard from './Configurateur/GroupCard';
import ButtonIcon from './ButtonIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface Props {
  mode: 'editable' | 'post';
  open: boolean;
  config: SetupPC;
  submitButtonTitle?: string;
  title: string;
  onClose(): void;
  onMessageChange?: (text: string) => void;
  onMessageIntroChange?: (text: string) => void;
  onConfirmConfig(config: SetupPC): void;
  onCopyConfig?(): void;
  onConfigChange?(config: SetupPC): void;
  onDeleteItem?(name: string): void;
  renderFooter?(): JSX.Element;
}

interface State {
  config: SetupPC;
  configCopied: boolean;
  message: string;
  messageIntro: string;
}

export default class ConfigDlg extends React.Component<Props, State> {
  state: State = {
    config: this.props.config,
    configCopied: false,
    message: '',
    messageIntro: ''
  };

  onSubjectIdConfigChange = (subjectId: string): void => {
    this.setState({
      config: { ...this.state.config, subjectId },
      configCopied: false
    });
  };

  onOwnerConfigChange = (owner: string): void => {
    this.setState({
      config: { ...this.state.config, owner },
      configCopied: false
    });
  };

  onConfigTagsChange = (tags: string[]): void => {
    this.setState({
      config: { ...this.state.config, tags },
      configCopied: false
    });
  };

  onConfigUrlChange = (url: string) => {
    this.setState({
      config: { ...this.state.config, url },
      configCopied: false
    });
  };

  onMessageChange = e => {
    const message = e.target.value;
    this.setState({ message });
    this.props.onMessageChange && this.props.onMessageChange(message);
  };

  onMessageIntroChange = e => {
    const messageIntro = e.target.value;
    this.setState({ messageIntro });
    this.props.onMessageIntroChange &&
      this.props.onMessageIntroChange(messageIntro);
  };

  onDeleteComponent = (id: string): void => {
    const components = this.state.config.components.filter(
      component => component.id !== id
    );
    this.setState({
      config: { ...this.state.config, components },
      configCopied: false
    });
  };

  onConfirmConfig = (): void => {
    this.props.onConfirmConfig(this.state.config);
    this.setState({ configCopied: false });
  };

  onComponentChange = (editedComponent: ComponentPC): void => {
    const components = this.state.config.components.map(component => {
      if (component.name === name) {
        return editedComponent;
      }
      return component;
    });

    this.setState({
      config: { ...this.state.config, components },
      configCopied: false
    });
  };

  onConfigChange = (config: SetupPC) => {
    this.props.onConfigChange && this.props.onConfigChange(config);
  };

  onAddComponentClick = () => {
    console.log('test');
  };

  render() {
    if (!this.props.open) return null;

    const { submitButtonTitle, title } = this.props;
    const { config } = this.state;
    return (
      <Modal
        title={title}
        height={950}
        width={1200}
        submitButtonTitle={submitButtonTitle || 'Confirmer'}
        onConfirm={this.onConfirmConfig}
        {...this.props}>
        {this.props.mode === 'post' && (
          <>
            <Label>Message:</Label>
            <TextArea
              value={this.state.messageIntro}
              onChange={this.onMessageIntroChange}
            />
          </>
        )}
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
              <HorizontalLayout>
                <Label>Lien vers la config:</Label>
                <LinkInput
                  value={config.url}
                  onChange={this.onConfigUrlChange}
                />
              </HorizontalLayout>
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
          <AddButton
            onClick={this.onAddComponentClick}
            width="50px"
            height="50px">
            <FontAwesomeIcon icon={faPlus} />
          </AddButton>
        </GroupCard>
        <RowReverseLayout>
          <NumberInput
            value={config.refund}
            onChange={value => {
              config.refund = value;
              this.onConfigChange(config);
            }}
            step={1}
            min={0}
            size={2}
            style={{
              input: {
                height: '30px',
                margin: '0px'
              }
            }}
          />
          <Label>&nbsp;%</Label>
          <NumberInput
            value={config.refundPercent}
            onChange={value => {
              config.refundPercent = value;
              this.onConfigChange(config);
            }}
            step={1}
            min={0}
            max={100}
            size={2}
            style={{
              input: {
                height: '30px',
                margin: '0px'
              }
            }}
          />
          <Label>Remise globale:</Label>
        </RowReverseLayout>
        <RowReverseLayout>
          <PriceText>
            Prix total:{' '}
            {`${new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: config.currency
            }).format(SetupPC.getPriceWithRefund(config))}`}
          </PriceText>
        </RowReverseLayout>
        {(config.refund !== 0 || config.refundPercent !== 0) && (
          <RowReverseLayout>
            <TitleH4>
              Remise:{' '}
              {`${new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: config.currency
              }).format(SetupPC.getTotalRefund(config))}`}
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
  height: '150px',
  background: '#333',
  color: '#FFF',
  marginTop: '5px',
  '&:focus': {
    background: '#333',
    color: '#FFF'
  }
});

const Label = emotion('label')({
  fontSize: '15px',
  margin: '0px 10px 0px 0px',
  color: '#676767!important'
});

const LinkInput = emotion(Input)({
  width: '100%'
});

const NumberInput = emotion(NumericInput)({
  width: '60px'
});

const AddButton = emotion(ButtonIcon)({});
