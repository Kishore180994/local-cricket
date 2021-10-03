import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { setEndOfInnigsModal } from '../../actions';
import Modal from '../../Modal';
import {
  selectBowlingTeam,
  selectFirstInnigs,
  selectTotalBallsPlayed,
} from '../../reducers/currentScore/currentScore.selectors';
import { convertBallsToOvers } from '../../util';
import { MainContent, MainSection, SubSection } from './end-of-innings.styles';
import { getSubHeading } from './end-of-innings.utils';

class EndOfInnings extends React.Component {
  renderContent = () => {
    const { stats, toss, choose } = this.props.firstInnings;
    return (
      <MainContent>
        <MainSection>
          <div className='team-name'>{this.props.firstInnings.name}</div>
          <div className='team-sub'>{getSubHeading(toss, choose)}</div>
        </MainSection>
        <SubSection>
          <div className='stats'>
            <div className='score'>
              <label className='score-label'>Total Score</label>
              <div className='score-numbers'>
                <div className='score-runs'>{stats.totalRuns}</div>
                <div className='score-wickets'>{stats.totalWickets}</div>
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
            from {this.props.totalBalls} balls.
          </div>
        </SubSection>
      </MainContent>
    );
  };
  renderActions = () => (
    <div>
      <button className='ui positive button'>Start Second Innings</button>
      <button
        className='ui negative button'
        onClick={(e) => {
          e.preventDefault();
          this.props.setEOIHidden(true);
        }}>
        Cancel
      </button>
    </div>
  );
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
  firstInnings: selectFirstInnigs,
  totalBalls: selectTotalBallsPlayed,
  bowlingTeam: selectBowlingTeam,
});

const mapDispatchToProps = (dispatch) => ({
  setEOIHidden: (val) => dispatch(setEndOfInnigsModal(val)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EndOfInnings);
