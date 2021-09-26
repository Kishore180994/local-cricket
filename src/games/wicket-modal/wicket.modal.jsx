import React from 'react';
import { connect } from 'react-redux';
import Modal from '../../Modal';
import {
  movePlayer,
  addStriker,
  addNonStriker,
  addWicket,
  setWicketModal,
  swapStriker,
} from '../../actions';
import { createStructuredSelector } from 'reselect';

import {
  selectWicketModalHiddenValue,
  selectWicketType,
} from '../../reducers/modal/modal.selectors';
import { selectStriker } from '../../reducers/currentScore/currentScore.selectors';
import {
  BastmanHeader,
  Header,
  NextBatsman,
  StatsHeader,
  Content,
} from './wicket.styles';
import {
  BOWLED,
  HIT_WICKET,
  LBW,
  STUMP_OUT,
  CAUGHT_OUT,
  RUN_OUT,
} from '../../actions/types';
import { render } from 'sass';

class WicketModal extends React.Component {
  state = {
    name: '',
    side: '',
  };

  componentWillUnmount() {}
  handleSubmit = async () => {
    // Move the current striker to firstInnings players
    const { striker, movePlayer, addStriker, addWicket, swapStriker } =
      this.props;
    await movePlayer(striker.name);
    // Set the new player to striker
    await addStriker(this.state.name);
    await addWicket();
    await swapStriker();
    this.setState({ name: '' });
  };

  renderHeader = () => {
    const { wicketType } = this.props;
    render(
      <React.Fragment>
        <Header>{wicketType}!!!</Header>
      </React.Fragment>
    );
  };

  renderContent = () => {
    const { wicketType } = this.props;
    if (
      wicketType === BOWLED ||
      wicketType === HIT_WICKET ||
      wicketType === LBW ||
      wicketType === STUMP_OUT ||
      wicketType === CAUGHT_OUT
    )
      return this.renderPredictedContent(wicketType);
  };

  renderUnpredictedContent = () => <div></div>;

  renderPredictedContent = () => (
    <Content className='ui divided middle selection list'>
      <BastmanHeader>
        <span className='name'>Bastman</span>
        <span className='score'>
          <span className='runs'>65</span>
          <span className='balls'>(12)</span>
        </span>
        <span className='bowler'>
          <span className='wicket-type'>b</span>
          <span className='bowler-name'>Bowler</span>
        </span>
        <span className='fow'>fow: 65/1</span>
      </BastmanHeader>
      <StatsHeader>
        <span className='boundaries'>
          <span className='fours'>Fours: 6</span>
          <span className='sixes'>Sixes: 8</span>
        </span>
        <span>SR: 108</span>
      </StatsHeader>
      <NextBatsman>
        <div className='ui black ribbon label'>Next Batsman</div>
        <form>
          <div className='ui input'>
            <input
              type='text'
              placeholder='Next Batsman'
              value={this.state.name}
              onChange={(e) => {
                e.stopPropagation();
                this.setState({ name: e.target.value });
              }}
              required
            />
          </div>
        </form>
        <div className='ui buttons'>
          <button className='ui button'>Striker</button>
          <div className='or'></div>
          <button className='ui button'>Non Striker</button>
        </div>
      </NextBatsman>
    </Content>
  );

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
        onClick={(e) => {
          e.stopPropagation();
          this.handleSubmit();
          this.props.setWicketModal(true);
        }}>
        Submit
      </button>
      <button
        className='ui button negative'
        onClick={(e) => {
          e.preventDefault();
          this.props.setWicketModal(true);
        }}>
        Cancel
      </button>
    </div>
  );

  onDismiss = () => {
    this.props.setWicketModal(true);
  };

  render() {
    return (
      <div>
        <Modal
          onDismiss={this.onDismiss}
          hidden={this.props.hidden}
          header={this.renderHeader()}
          content={this.renderContent()}
          actions={this.renderActions()}
        />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  hidden: selectWicketModalHiddenValue,
  wicketType: selectWicketType,
  striker: selectStriker,
});

export default connect(mapStateToProps, {
  setWicketModal,
  movePlayer,
  addStriker,
  addNonStriker,
  addWicket,
  swapStriker,
})(WicketModal);
