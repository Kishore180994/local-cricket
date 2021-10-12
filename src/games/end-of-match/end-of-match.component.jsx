import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { clearUndoHistory, setEndOfMatchModal } from '../../actions';
import Modal from '../../Modal';
import { selectMatchId } from '../../reducers/currentScore/currentScore.selectors';
import { convertBallsToOvers, convertOversToBalls } from '../../util';
import { MainContent, MainSection, SubSection } from './end-of-match.styles';
import {
  selectFirstInnings,
  selectSecondInnings,
  selectTossChoose,
  selectWhoWonToss,
} from '../../reducers/currentScore/currentScore.staticSelectors.js';
import { getTopBatsman, getTopBowler, whoWonGame } from './end-of-match.utils';
import { Link } from 'react-router-dom';

class EndOfMatch extends React.Component {
  handleSubmit = (e) => {
    e.stopPropagation();
    this.props.setEOIHidden(true);
    this.props.clearUndoHistory();
  };
  renderContent = () => {
    const { firstInnings, secondInnings, toss, choose } = this.props;
    const firstInningsTopBatsman = getTopBatsman(firstInnings.players).obj;
    const secondInningsTopBatsman = getTopBatsman(secondInnings.players).obj;

    const firstInningsTopBowler = getTopBowler(firstInnings.players).obj;
    const secondInningsTopBowler = getTopBowler(secondInnings.players).obj;
    return (
      <MainContent>
        <MainSection>
          <div className='team-name'>{`${firstInnings.name} vs ${secondInnings.name}`}</div>
          <div className='team-sub'>{`${toss.name} won the toss and chose ${choose} first`}</div>
        </MainSection>
        <SubSection>
          <div className='stats'>
            <div className='teamhandle'>
              <div className='header'>
                <div className='team-name'>{firstInnings.name}</div>
                <div className='team-score'>
                  {firstInnings.stats.totalRuns}/
                  {firstInnings.stats.totalWickets}
                </div>
              </div>
              <div className='sub-header'>
                <div className='top-batsman'>
                  <div>{firstInningsTopBatsman.name}</div>
                  <div>{`${firstInningsTopBatsman.batting.runs}(${firstInningsTopBatsman.batting.balls})`}</div>
                </div>
                <div className='top-bowler'>
                  <div>{firstInningsTopBowler.name}</div>
                  <div>{`${firstInningsTopBatsman.bowling.runs}/${firstInningsTopBatsman.bowling.wickets}`}</div>
                </div>
              </div>
            </div>
            <div className='teamhandle'>
              <div className='header'>
                <div className='team-name'>{secondInnings.name}</div>
                <div className='team-score'>
                  {secondInnings.stats.totalRuns}/
                  {secondInnings.stats.totalWickets}
                </div>
              </div>
              <div className='sub-header'>
                <div className='top-batsman'>
                  <div>{secondInningsTopBatsman.name}</div>
                  <div>{`${secondInningsTopBatsman.batting.runs}(${secondInningsTopBatsman.batting.balls})`}</div>
                </div>
                <div className='top-bowler'>
                  <div>{secondInningsTopBowler.name}</div>
                  <div>{`${secondInningsTopBowler.bowling.runs}/${secondInningsTopBowler.bowling.wickets}`}</div>
                </div>
              </div>
            </div>
          </div>
          <div className='innings-text'>
            {whoWonGame(firstInnings, secondInnings)} won the game.
          </div>
        </SubSection>
      </MainContent>
    );
  };
  renderActions = () => {
    return (
      <div>
        <button
          className='ui positive button'
          onClick={(e) => this.handleSubmit(e)}>
          Start New Match
        </button>
        <Link
          to={`/games/scorecard/${this.props.matchId}`}
          className='ui blue button'>
          View Score-Card
        </Link>
      </div>
    );
  };
  render() {
    return (
      <Modal
        onDismiss={() => {}}
        header='END OF THE MATCH'
        content={this.renderContent()}
        actions={this.renderActions()}
      />
    );
  }
}

const mapStateToProps = createStructuredSelector({
  matchId: selectMatchId,
  firstInnings: selectFirstInnings,
  secondInnings: selectSecondInnings,
  toss: selectWhoWonToss,
  choose: selectTossChoose,
});

const mapDispatchToProps = (dispatch) => ({
  clearUndoHistory: () => dispatch(clearUndoHistory()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EndOfMatch);
