import * as React from 'react';
import * as DOM from 'react-dom';

export default class PopupApp extends React.Component<{}> {
  render() {
    return (
      <div>
        <p>Test de popup</p>
      </div>
    );
  }
}

DOM.render(<PopupApp />, document.getElementById('root'));
