import React from 'react';
import { connect } from 'react-redux';
import Modal from '../../Modal';
import RenderInput from '../render-input/render-input.component';

import {
  addBowler,
  moveBowler,
  setBowlerModal,
  setEndOfInnigsModal,
} from '../../actions';
import { BowlerHeader } from './bowler-modal.styles';
import { createStructuredSelector } from 'reselect';
import {
  selectBowler,
  selectBowlingTeam,
} from '../../reducers/currentScore/currentScore.selectors';
import { convertBallsToOvers } from '../../util';

class BowlerModal extends React.Component {
  state = {
    bowler: '',
    bowlerObject: null,
  };

  handleSubmit = () => {
    //Move the current bowler to the secondInnings
    const { moveBowler, addBowler } = this.props;
    moveBowler();
    if (this.state.bowlerObject) addBowler(this.state.bowlerObject);
    else if (this.state.bowler) addBowler(this.state.bowler);
    else console.log('Check bowler model component');
    this.setState({ bowler: '', bowlerId: null });
    this.props.setBowlerModal(true);
  };

  renderHeader = () => <div>END OF THE OVER</div>;

  onValueChange = (e, bowlerObject) => {
    bowlerObject
      ? this.setState({ bowlerObject: bowlerObject, bowler: bowlerObject.name })
      : this.setState({ bowler: e.target.value, bowlerObject: null });
  };

  renderContent = () => {
    const {
      currentBowler: {
        name,
        bowling: { runs, wickets, balls },
      },
      currentBowlingTeam: { players },
    } = this.props;
    return (
      <div>
        <BowlerHeader>
          <div className='bowler-name'>{name}</div>
          <div className='bowler-score-group'>
            <div className='bowler-score'>
              {runs}/{wickets}
            </div>
            <div className='bowler-overs'>
              {convertBallsToOvers(balls)} over(s)
            </div>
          </div>
          <div className='last-over'>Last Over: 14</div>
        </BowlerHeader>
        <RenderInput
          label='Next bowler'
          placeholder='Enter new or Select bowler*'
          options={players.filter(
            (player) => player.playerId !== this.props.currentBowler.playerId
          )}
          value={this.state.bowler}
          onValueChange={this.onValueChange}
          dropDownPlaceHolder='No bowlers yet!! Enter the new Bowler name!!'
          modalType='bowler'
          required
        />
      </div>
    );
  };

  handleEndOfInningsModal = () => {
    this.props.setBowlerModal(true);
    this.props.setEndOfInnigsModal(false);
  };

  onDismiss = () => {
    // this.props.setBowlerModal(true);
  };
  renderActions = () => (
    <div>
      <button
        className='ui left floated button negative'
        style={{ marginLeft: '0.1rem' }}
        onClick={(e) => {
          e.stopPropagation();
          this.handleEndOfInningsModal();
        }}>
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

const mapStateToProps = createStructuredSelector({
  currentBowler: selectBowler,
  currentBowlingTeam: selectBowlingTeam,
});

export default connect(mapStateToProps, {
  setBowlerModal,
  moveBowler,
  addBowler,
  setEndOfInnigsModal,
})(BowlerModal);
