import React from 'react';
import history from '../../history.js';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  clearUndoHistory,
  setEndOfInnigsModal,
  switchInnings,
} from '../../actions';
import Modal from '../../Modal';
import {
  selectBowlingTeam,
  selectBattingTeam,
  selectMatchId,
  selectTotalBallsPlayed,
  selectOvers,
} from '../../reducers/currentScore/currentScore.selectors';
import { convertBallsToOvers, convertOversToBalls } from '../../util';
import { MainContent, MainSection, SubSection } from './end-of-innings.styles';
import { getSubHeading } from './end-of-innings.utils';
import { selectIsFirstInningsFinished } from '../../reducers/currentScore/currentScore.staticSelectors.js';

class EndOfInnings extends React.Component {
  handleSubmit = (e) => {
    e.stopPropagation();
    this.props.switchInnings();
    history.push(`/games/view/${this.props.matchId}`);
    this.props.setEOIHidden(true);
    this.props.clearUndoHistory();
  };
  renderContent = () => {
    const { stats, toss, choose } = this.props.battingTeam;
    return (
      <MainContent>
        <MainSection>
          <div className='team-name'>{this.props.battingTeam.name}</div>
          <div className='team-sub'>{getSubHeading(toss, choose)}</div>
        </MainSection>
        <SubSection>
          <div className='stats'>
            <div className='score'>
              <label className='score-label'>Total Score</label>
              <div className='score-numbers'>
                <div className='score-runs'>{stats.totalRuns || 0}</div>/
                <div className='score-wickets'>{stats.totalWickets || 0}</div>
              </div>
            </div>
            <div className='overs'>
              <div className='overs-count'>
                {convertBallsToOvers(stats.totalBalls)}
              </div>
              <div className='overs-text'>over(s)</div>
            </div>
          </div>
          <div className='innings-text'>
            {this.props.bowlingTeam.name} need {stats.totalRuns + 1} runs to win
            from {convertOversToBalls(this.props.totalOvers)} balls.
          </div>
        </SubSection>
      </MainContent>
    );
  };
  renderActions = () => {
    const cancelClassName = `ui negative button ${
      this.props.isFirstInningsFinished ? 'disabled' : ''
    }`;
    return (
      <div>
        <button
          className='ui positive button'
          onClick={(e) => this.handleSubmit(e)}>
          Start Second Innings
        </button>
        <button
          className={cancelClassName}
          onClick={(e) => {
            e.preventDefault();
            this.props.setEOIHidden(true);
          }}>
          Cancel
        </button>
      </div>
    );
  };
  render() {
    return (
      <Modal
        onDismiss={() => {}}
        header='END OF THE INNINGS'
        content={this.renderContent()}
        actions={this.renderActions()}
      />
    );
  }
}

const mapStateToProps = createStructuredSelector({
  matchId: selectMatchId,
  battingTeam: selectBattingTeam,
  isFirstInningsFinished: selectIsFirstInningsFinished,
  totalBalls: selectTotalBallsPlayed,
  bowlingTeam: selectBowlingTeam,
  totalOvers: selectOvers,
});

const mapDispatchToProps = (dispatch) => ({
  setEOIHidden: (val) => dispatch(setEndOfInnigsModal(val)),
  switchInnings: () => dispatch(switchInnings()),
  clearUndoHistory: () => dispatch(clearUndoHistory()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EndOfInnings);
