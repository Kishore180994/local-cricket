import React from 'react';
import { connect } from 'react-redux';
import Modal from '../../Modal';
import {
  addStriker,
  addNonStriker,
  addWicket,
  setWicketModal,
  swapStriker,
  swapStrikerForce,
  setBatsmanOut,
  removeBatsmanStatus,
  addRunToPlayer,
} from '../../actions';
import { createStructuredSelector } from 'reselect';

import {
  selectBastmanWhoGotOut,
  selectWicketModalHiddenValue,
  selectWicketType,
} from '../../reducers/modal/modal.selectors';
import {
  selectBattingTeam,
  selectBattingTeamScore,
  selectBattingTeamWickets,
  selectBowler,
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
  STRIKER,
  NON_STRIKER,
} from '../../actions/types';
import { getStrikeRate } from '../../util';
import RenderInput from '../render-input/render-input.component';

class WicketModal extends React.Component {
  state = {
    chooseNextBatsman: null,
    chooseNextBatsmanSide: '',
    runOutCheckedValue: '',
    runsScoredOnRunOut: 0,
  };

  onValueChange = (e, batsmanObject) => {
    e.stopPropagation();
    if (batsmanObject) this.setState({ chooseNextBatsman: batsmanObject });
    else this.setState({ chooseNextBatsman: e.target.value });
  };

  handleSubmit = async () => {
    const {
      striker,
      nonStriker,
      addStriker,
      addNonStriker,
      addWicket,
      swapStriker,
      wicketType,
      setWicketModal,
      setBatsmanOut,
      outNonStrikerActionOrder,
      outStrikerActionOrder,
      addRunsToStrikerBeforeRunout,
      removeBatsmanStatus,
    } = this.props;
    const { chooseNextBatsman, chooseNextBatsmanSide, runOutCheckedValue } =
      this.state;
    if (chooseNextBatsman) {
      switch (wicketType) {
        case CAUGHT_OUT:
          setBatsmanOut(striker);
          if (chooseNextBatsmanSide) {
            if (chooseNextBatsmanSide === 'striker') {
              // remove striker status from the player
              await removeBatsmanStatus(STRIKER, wicketType);
              // Choose next batsman can be either string or Object.
              await addStriker(chooseNextBatsman);
            } else if (chooseNextBatsmanSide === 'nonStriker') {
              // remove non-striker status from the player.
              await removeBatsmanStatus(NON_STRIKER, wicketType);
              await outNonStrikerActionOrder(chooseNextBatsman);
            }
            await addWicket(CAUGHT_OUT);
            setWicketModal(true);
            setBatsmanOut(null);
          } else {
            alert('Choose the new Batsman side.');
          }
          break;
        case RUN_OUT:
          if (runOutCheckedValue) {
            const outRoleType =
              runOutCheckedValue === striker.playerId ? STRIKER : NON_STRIKER;
            const outRole =
              runOutCheckedValue === striker.playerId ? striker : nonStriker;
            // Move the player who got out to the pavilion
            setBatsmanOut(outRole);
            // Add runs to the "outrole object and total score card"
            // before moving the player to pavilion.
            await addRunsToStrikerBeforeRunout(this.state.runsScoredOnRunOut);
            await removeBatsmanStatus(outRoleType, wicketType);
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
              await addWicket(RUN_OUT);
              setWicketModal(true);
              setBatsmanOut(null);
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
            const outRoleType =
              runOutCheckedValue === striker.playerId ? STRIKER : NON_STRIKER;
            const outRole =
              runOutCheckedValue === striker.playerId ? striker : nonStriker;
            setBatsmanOut(outRole);
            await removeBatsmanStatus(outRoleType, wicketType);
            if (outRole.playerId === striker.playerId)
              await addStriker(chooseNextBatsman);
            else {
              await addNonStriker(chooseNextBatsman);
            }
            setWicketModal(true);
            setBatsmanOut(null);
          } else {
            alert('Please select the player who got retired hurt!!');
          }
          break;
        case BOWLED:
        case HIT_WICKET:
        case LBW:
        case STUMP_OUT:
          setBatsmanOut(striker);
          await removeBatsmanStatus(STRIKER, wicketType);
          await addStriker(chooseNextBatsman);
          await addWicket(wicketType);
          setWicketModal(true);
          setBatsmanOut(null);
          break;
        default:
          setBatsmanOut(striker);
          await addWicket(STUMP_OUT);
          await swapStriker();
          this.setState({ chooseNextBatsman: null });
          setWicketModal(true);
          setBatsmanOut(null);
          break;
      }
      await swapStriker();
      await setBatsmanOut(null);
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

  handleChecked = async (e, player) => {
    const { striker, nonStriker, setBatsmanOut } = this.props;
    this.setState({ runOutCheckedValue: player.playerId });
    let outObject = player.playerId === striker.playerId ? striker : nonStriker;
    setBatsmanOut(outObject);
  };

  setBattingSide = (e, val) => {
    e.stopPropagation();
    this.setState({ chooseNextBatsmanSide: val });
  };

  renderUnpredictedContent = (wicketType) => {
    const { striker, nonStriker } = this.props;
    const { runOutCheckedValue } = this.state;
    const strikerClassName = `ui button ${
      striker?.playerId === runOutCheckedValue ? 'blue active' : ''
    }`;
    const nonStrikerClassName = `ui button ${
      nonStriker?.playerId === runOutCheckedValue ? 'blue active' : ''
    }`;
    return (
      <Content className='ui divided middle selection list'>
        <label className='ui pointing below red basic label'>
          Select who is out?
        </label>
        <RadioWrapper className='ui buttons'>
          <RadioLabel
            className={strikerClassName}
            value={striker?.name}
            onClick={(e) => this.handleChecked(e, striker)}>
            {striker?.name}
          </RadioLabel>
          <div className='or'>or</div>
          <RadioLabel
            className={nonStrikerClassName}
            value={nonStriker?.name}
            onClick={(e) => this.handleChecked(e, nonStriker)}>
            {nonStriker?.name}
          </RadioLabel>
        </RadioWrapper>
        {runOutCheckedValue ? this.renderCommonContent(wicketType) : ''}
      </Content>
    );
  };

  renderCommonContent = (wicketType) => {
    let { striker, bowler, currentBatsmanWhoGotOut } = this.props;
    if (!currentBatsmanWhoGotOut) setBatsmanOut(striker);
    const outBatsman = currentBatsmanWhoGotOut
      ? currentBatsmanWhoGotOut
      : striker;
    const {
      name,
      batting: { runs, balls, fours, sixes },
    } = outBatsman;
    const {
      teamScore,
      teamWickets,
      currentBattingTeam: { players },
    } = this.props;
    return (
      <React.Fragment>
        <BastmanHeader>
          <span className='name'>{name}</span>
          <span className='score'>
            <span className='runs'>{runs}</span>
            {wicketType === RETIRED_HURT ? (
              <span className='balls'>({balls})</span>
            ) : (
              <span className='balls'>({balls + 1})</span>
            )}
          </span>
          <span className='bowler'>
            <span className='wicket-type'>b</span>
            <span className='bowler-name'>{bowler.name}</span>
          </span>
          {wicketType !== RETIRED_HURT ? (
            <span className='fow'>
              fow: {teamScore}/{teamWickets}
            </span>
          ) : (
            <React.Fragment></React.Fragment>
          )}
        </BastmanHeader>
        <StatsHeader>
          <span className='boundaries'>
            <span className='fours'>Fours: {fours}</span>
            <span className='sixes'>Sixes: {sixes}</span>
          </span>
          {wicketType === RETIRED_HURT ? (
            <span>SR: {getStrikeRate(runs, balls) || 0}</span>
          ) : (
            <span>SR: {getStrikeRate(runs, balls + 1) || 0}</span>
          )}
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
                    this.setState({
                      runsScoredOnRunOut: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
            </div>
          ) : null}
          <span className='container'>
            {/* <div className='ui black ribbon label'>Next Batsman</div> */}
            <form id='myform'>
              <div className='ui input'>
                {/* <input
                  type='text'
                  placeholder='Next Batsman'
                  value={this.state.chooseNextBatsman}
                  onChange={(e) => {
                    e.stopPropagation();
                    this.setState({ chooseNextBatsman: e.target.value });
                  }}
                  required
                /> */}
                <RenderInput
                  label='Next Batsman'
                  placeholder='Enter new or select batsman'
                  options={players.filter((player) => {
                    const outBatsman = this.props.currentBatsmanWhoGotOut
                      ? this.props.currentBatsmanWhoGotOut
                      : striker;
                    return (
                      player.status !== STRIKER &&
                      player.playerId !== outBatsman.playerId &&
                      player.status !== NON_STRIKER &&
                      player.status !== CAUGHT_OUT &&
                      player.status !== RUN_OUT &&
                      player.status !== BOWLED &&
                      player.status !== HIT_WICKET &&
                      player.status !== LBW &&
                      player.status !== STUMP_OUT
                    );
                  })}
                  value={
                    this.state.chooseNextBatsman === 'string'
                      ? this.state.chooseNextBatsman
                      : this.state.chooseNextBatsman?.name
                  }
                  onValueChange={this.onValueChange}
                  dropDownPlaceHolder='Enter new Batsman name!'
                  modalType='batsman'
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
  };

  renderPredictedContent = (wicketType) => (
    <Content className='ui divided middle selection list'>
      {this.renderCommonContent(wicketType)}
    </Content>
  );

  renderActions = () => {
    const batsmanClassName = `ui button ${
      this.state.chooseNextBatsman ? '' : 'disabled'
    }`;
    return (
      <div>
        <button
          className='ui left floated button negative'
          style={{ marginLeft: '0.1rem' }}>
          <i className='close icon'></i>
          <label>End Match</label>
        </button>
        <button
          className={batsmanClassName}
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
            this.props.setBatsmanOut(null);
          }}>
          Cancel
        </button>
      </div>
    );
  };

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
  bowler: selectBowler,
  teamScore: selectBattingTeamScore,
  teamWickets: selectBattingTeamWickets,
  currentBattingTeam: selectBattingTeam,
  currentBatsmanWhoGotOut: selectBastmanWhoGotOut,
});

const mapDispatchToProps = (dispatch) => ({
  outStrikerActionOrder: (name) => {
    dispatch(swapStrikerForce());
    dispatch(addStriker(name));
  },
  outNonStrikerActionOrder: (nameOrObject) => {
    dispatch(swapStrikerForce());
    dispatch(addNonStriker(nameOrObject));
  },
  setWicketModal: (val) => dispatch(setWicketModal(val)),
  swapStriker: () => dispatch(swapStriker()),
  swapStrikerForce: () => dispatch(swapStrikerForce()),
  removeBatsmanStatus: (batsmanType, wicketType) =>
    dispatch(removeBatsmanStatus(batsmanType, wicketType)),
  addStriker: (name) => dispatch(addStriker(name)),
  addRunsToStrikerBeforeRunout: (runs) => dispatch(addRunToPlayer(runs)),
  addNonStriker: (name) => dispatch(addNonStriker(name)),
  addWicket: (val) => dispatch(addWicket(val)),
  setBatsmanOut: (name) => dispatch(setBatsmanOut(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WicketModal);
