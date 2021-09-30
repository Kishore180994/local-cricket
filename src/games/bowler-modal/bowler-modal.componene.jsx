import React from 'react';
import { connect } from 'react-redux';
import Modal from '../../Modal';
import RenderInput from '../render-input/render-input.component';

import { setBowlerModal } from '../../actions';
import { BowlerHeader } from './bowler-modal.styles';
import { createStructuredSelector } from 'reselect';

class BowlerModal extends React.Component {
  state = {
    bowler: '',
  };

  handleSubmit = () => {
    //Move the current bowler to the secondInnings
  };

  renderHeader = () => <div>END OF THE OVER</div>;

  onValueChange = (e, value) => {
    value
      ? this.setState({ bowler: value })
      : this.setState({ bowler: e.target.value });
  };

  renderContent = () => (
    <div>
      <BowlerHeader>
        <div className='bowler-name'>{this.state.bowler}</div>
        <div className='bowler-score'>1/18 (3 overs )</div>
        <div className='last-over'>LastOver: 14</div>
      </BowlerHeader>
      <RenderInput
        label='Next bowler'
        placeholder='Enter new or Select bowler*'
        options={this.options}
        value={this.state.bowler}
        onValueChange={this.onValueChange}
        required
      />
    </div>
  );
  onDismiss = () => {
    // this.props.setBowlerModal(true);
  };
  renderActions = () => (
    <div>
      <button
        className='ui left floated button negative'
        style={{ marginLeft: '0.1rem' }}>
        <i className='close icon'></i>
        <label>End Match</label>
      </button>
      <button
        className='ui button'
        form='myform'
        onClick={(e) => {
          e.stopPropagation();
          this.handleSubmit();
        }}>
        Submit
      </button>
      <button
        className='ui button negative'
        onClick={(e) => {
          e.preventDefault();
          this.props.setBowlerModal(true);
          // this.props.setBatsmanOut(null);
        }}>
        Cancel
      </button>
    </div>
  );
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

const mapStateToProps = createStructuredSelector({});

export default connect(mapStateToProps, { setBowlerModal })(BowlerModal);
