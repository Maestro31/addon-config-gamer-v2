import * as React from 'react';
import emotion from 'react-emotion';
import TextInput from './TextInput';
import {
  HorizontalLayout,
  SubmitButton,
  CancelButton
} from './SharedComponents';
import ButtonIcon from './ButtonIcon';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  onSubmit: (url: string) => void;
}

interface State {
  isOpen: boolean;
  url: string;
}

export default class AddComponentPCButton extends React.Component<
  Props,
  State
> {
  state = {
    isOpen: false,
    url: ''
  };

  onSubmit = () => {
    if (this.state.url === '') return;

    this.setState({ isOpen: false, url: '' });
    this.props.onSubmit && this.props.onSubmit(this.state.url);
  };

  render() {
    return (
      <>
        {this.state.isOpen ? (
          <AddComponentLayout>
            <LinkComponentInput
              placeholder="Inserer le lien ici..."
              onChange={(url: string) => this.setState({ url })}
            />
            <SubmitButton
              style={{ marginLeft: '10px' }}
              onClick={this.onSubmit}
              title="Ajouter"
            />
            <CancelButton
              style={{ marginRight: 0 }}
              onClick={() => this.setState({ isOpen: false, url: '' })}
              title="Annuler"
            />
          </AddComponentLayout>
        ) : (
          <AddButton
            onClick={() => this.setState({ isOpen: true })}
            height="50px">
            <FontAwesomeIcon icon={faPlus} />
          </AddButton>
        )}
      </>
    );
  }
}

const AddButton = emotion(ButtonIcon)({
  fontSize: '2em',
  border: '1px solid gray',
  width: '100%',
  margin: '10px auto'
});

const LinkComponentInput = emotion(TextInput)({
  '& input': {
    margin: 0
  }
});

const AddComponentLayout = emotion(HorizontalLayout)({
  margin: '10px auto',
  height: '50px'
});
