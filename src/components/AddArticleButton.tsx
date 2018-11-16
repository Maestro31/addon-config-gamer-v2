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
import ReactLoading from 'react-loading';

interface Props {
  onSubmit: (url: string) => void;
  loading: boolean;
}

interface State {
  isOpen: boolean;
  url: string;
}

export default class AddArticleButton extends React.Component<Props, State> {
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
          <Container>
            <ArticleUrlInput
              placeholder="Inserer le lien de l'article ici..."
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
          </Container>
        ) : (
          <AddButton
            onClick={() =>
              !this.props.loading && this.setState({ isOpen: true })
            }
            height="50px">
            {this.props.loading ? (
              <ReactLoading type="bars" color="#A7A7A7" />
            ) : (
              <FontAwesomeIcon icon={faPlus} />
            )}
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

const ArticleUrlInput = emotion(TextInput)({
  '& input': {
    margin: 0
  }
});

const Container = emotion(HorizontalLayout)({
  margin: '10px auto',
  height: '50px'
});
