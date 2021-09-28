import React from 'react';
import { connect } from 'react-redux';
import Modal from '../../Modal';
import RenderInput from '../render-input/render-input.component';

import { setBowlerModal } from '../../actions';

class BowlerModal extends React.Component {
  options = ['bowler1', 'bowler2'];
  renderContent = () => (
    <div>
      <RenderInput
        label='select the next bowler'
        placeholder='Enter new bowler or select from the list below'
        options={this.options}
      />
    </div>
  );
  onDismiss = () => {
    this.props.setBowlerModal(true);
  };
  renderActions() {}
  render() {
    return (
      <Modal
        header='END OF THE OVER'
        content={this.renderContent()}
        actions={this.renderActions()}
        onDismiss={this.onDismiss}
      />
    );
  }
}

export default connect(null, { setBowlerModal })(BowlerModal);
