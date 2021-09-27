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
  swapStrikerForce,
} from '../../actions';
import { createStructuredSelector } from 'reselect';

import {
  selectWicketModalHiddenValue,
  selectWicketType,
} from '../../reducers/modal/modal.selectors';
import {
  selectNonStriker,
  selectStriker,
} from '../../reducers/currentScore/currentScore.selectors';
import {
  BastmanHeader,
  Header,
  NextBatsman,
  StatsHeader,
  Content,
  RadioWrapper,
  RadioLabel,
} from './wicket.styles';
import {
  BOWLED,
  HIT_WICKET,
  LBW,
  STUMP_OUT,
  CAUGHT_OUT,
  RUN_OUT,
  RETIRED_HURT,
} from '../../actions/types';

class WicketModal extends React.Component {
  state = {
    chooseNextBatsman: '',
    chooseNextBatsmanSide: '',
    runOutCheckedValue: '',
    runsScoredOnRunOut: 0,
  };

  componentWillUnmount() {}
  handleSubmit = async () => {
    const {
      striker,
      nonStriker,
      movePlayer,
      addStriker,
      addNonStriker,
      addWicket,
      swapStriker,
      wicketType,
      setWicketModal,
      outNonStrikerActionOrder,
      outStrikerActionOrder,
    } = this.props;
    const { chooseNextBatsmanSide, chooseNextBatsman, runOutCheckedValue } =
      this.state;
    if (this.state.chooseNextBatsman) {
      switch (wicketType) {
        case CAUGHT_OUT:
          if (chooseNextBatsmanSide) {
            if (chooseNextBatsmanSide === 'striker') {
              // Move the current striker to firstInnings players
              await movePlayer(striker.name);
              await addStriker(chooseNextBatsman);
            } else if (chooseNextBatsmanSide === 'nonStriker') {
              // The batsman cross the half pitch and caught out.
              // So, we need to swap the striker with non striker
              // and add the new batsman to non striker end.
              await movePlayer(striker.name).then(async () => {
                await outNonStrikerActionOrder(chooseNextBatsman);
              });
            }
            await addWicket();
            setWicketModal(true);
          } else {
            alert('Choose the new Batsman side.');
          }
          break;
        case RUN_OUT:
          if (runOutCheckedValue) {
            const outRole =
              runOutCheckedValue === striker.name ? striker : nonStriker;
            // Move the player who got out to the pavilion
            await movePlayer(outRole.name);
            if (chooseNextBatsmanSide) {
              if (
                outRole.name === striker.name &&
                chooseNextBatsmanSide === 'striker'
              ) {
                await addStriker(chooseNextBatsman);
              }
              if (
                outRole.name === striker.name &&
                chooseNextBatsmanSide === 'nonStriker'
              ) {
                await outNonStrikerActionOrder(chooseNextBatsman);
              }
              if (
                outRole.name === nonStriker.name &&
                chooseNextBatsmanSide === 'nonStriker'
              ) {
                await addNonStriker(chooseNextBatsman);
              }
              if (
                outRole.name === nonStriker.name &&
                chooseNextBatsmanSide === 'striker'
              ) {
                await outStrikerActionOrder(chooseNextBatsman);
              }
              await addWicket();
              setWicketModal(true);
            } else {
              alert('Please select where you want to place the new batsman.');
            }
          } else {
            alert('Choose the player who got run out!!');
          }
          break;
        case RETIRED_HURT:
          // RETIRED HURT conditions.
          // Do not count the ball.
          // Do not add any runs.
          // Just replace the player.
          if (runOutCheckedValue) {
            const outRole =
              runOutCheckedValue === striker.name ? striker : nonStriker;
            await movePlayer(outRole.name);
            if (outRole.name === striker.name)
              await addStriker(chooseNextBatsman);
            else {
              await addNonStriker(chooseNextBatsman);
            }
            setWicketModal(true);
          } else {
            alert('Please select the player who got retired hurt!!');
          }
          break;
        case BOWLED:
        case HIT_WICKET:
        case LBW:
        case STUMP_OUT:
          await movePlayer(striker.name);
          await addStriker(chooseNextBatsman);
          await addWicket();
          setWicketModal(true);
          break;
        default:
          await addWicket();
          await swapStriker();
          this.setState({ chooseNextBatsman: '' });
          setWicketModal(true);
          break;
      }
      await swapStriker();
    } else {
      alert('Please input the next batsman');
    }
  };

  renderHeader = () => (
    <React.Fragment>
      <Header>{this.props.wicketType}!!!</Header>
    </React.Fragment>
  );

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
    else if (wicketType === RUN_OUT)
      return this.renderUnpredictedContent(wicketType);
    else return this.renderUnpredictedContent(wicketType);
  };

  handleChecked = (e) => {
    this.setState({ runOutCheckedValue: e.target.textContent });
  };

  setBattingSide = (e, val) => {
    e.stopPropagation();
    this.setState({ chooseNextBatsmanSide: val });
  };

  renderUnpredictedContent = (wicketType) => {
    const { striker, nonStriker } = this.props;
    const { runOutCheckedValue } = this.state;
    const strikerClassName = `ui button ${
      striker.name === runOutCheckedValue ? 'blue active' : ''
    }`;
    const nonStrikerClassName = `ui button ${
      nonStriker.name === runOutCheckedValue ? 'blue active' : ''
    }`;
    return (
      <Content className='ui divided middle selection list'>
        <label className='ui pointing below red basic label'>
          Select who is out?
        </label>
        <RadioWrapper className='ui buttons'>
          <RadioLabel
            className={strikerClassName}
            value={striker.name}
            onClick={(e) => this.handleChecked(e)}>
            {striker.name}
          </RadioLabel>
          <div className='or'>or</div>
          <RadioLabel
            className={nonStrikerClassName}
            value={nonStriker.name}
            onClick={(e) => this.handleChecked(e)}>
            {nonStriker.name}
          </RadioLabel>
        </RadioWrapper>
        {runOutCheckedValue ? this.renderCommonContent(wicketType) : ''}
      </Content>
    );
  };

  renderCommonContent = (wicketType) => (
    <React.Fragment>
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
        <div className='ui divider'></div>
        {wicketType === RUN_OUT ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-evenly',
              flexWrap: 'wrap',
              marginBottom: '1em',
              marginRight: '1em',
            }}>
            <label>How many runs had been scored on this ball?</label>
            <div className='ui small input'>
              <input
                type='text'
                value={this.state.runsScoredOnRunOut}
                placeholder='runs(default: 0)'
                onChange={(e) =>
                  this.setState({ runsScoredOnRunOut: e.target.value })
                }
                required
              />
            </div>
          </div>
        ) : null}
        <span className='container'>
          <div className='ui black ribbon label'>Next Batsman</div>
          <form id='myform'>
            <div className='ui input'>
              <input
                type='text'
                placeholder='Next Batsman'
                value={this.state.chooseNextBatsman}
                onChange={(e) => {
                  e.stopPropagation();
                  this.setState({ chooseNextBatsman: e.target.value });
                }}
                required
              />
            </div>
          </form>
        </span>
        <div className='ui divider'></div>
        {wicketType === CAUGHT_OUT || wicketType === RUN_OUT ? (
          <React.Fragment>
            <label>Where do you want to place the new batsman?</label>
            <div className='ui buttons select-side'>
              <button
                className='ui button'
                onClick={(e) => this.setBattingSide(e, 'striker')}>
                Striker end
              </button>
              <div className='or'></div>
              <button
                className='ui button'
                onClick={(e) => this.setBattingSide(e, 'nonStriker')}>
                Non-Striker end
              </button>
            </div>
          </React.Fragment>
        ) : null}
      </NextBatsman>
    </React.Fragment>
  );

  renderPredictedContent = (wicketType) => (
    <Content className='ui divided middle selection list'>
      {this.renderCommonContent(wicketType)}
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
  nonStriker: selectNonStriker,
});

const mapDispatchToProps = (dispatch) => ({
  outStrikerActionOrder: (name) => {
    dispatch(swapStrikerForce());
    dispatch(addStriker(name));
  },
  outNonStrikerActionOrder: (name) => {
    dispatch(swapStrikerForce());
    dispatch(addNonStriker(name));
  },
  setWicketModal: (val) => dispatch(setWicketModal(val)),
  swapStriker: (name) => dispatch(swapStriker(name)),
  swapStrikerForce: () => dispatch(swapStrikerForce()),
  movePlayer: (name) => dispatch(movePlayer(name)),
  addStriker: (name) => dispatch(addStriker(name)),
  addNonStriker: (name) => dispatch(addNonStriker(name)),
  addWicket: () => dispatch(addWicket()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WicketModal);
