import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectBattingTeamScore,
  selectBattingTeamWickets,
  selectBowler,
  selectCurrentRunRate,
  selectNonStriker,
  selectOvers,
  selectStriker,
  selectTarget,
  selectTotalBallsPlayed,
} from '../../reducers/currentScore/currentScore.selectors';
import {
  ScoreColumn,
  ScoreMainContainer,
  ScoreRow,
  ScoreGrid,
  FooterGrid,
  FooterColumn,
  FooterRow,
} from './play-score-card.styles';
import { convertOversToBalls, getProjectedScore } from '../../util';
import { renderOvers } from '../game-play/game-play.utils';
import { selectIsFirstInnings } from '../../reducers/currentScore/currentScore.staticSelectors';

class PlayScoreCard extends React.Component {
  render() {
    const {
      battingTeamScore,
      battingTeamWickets,
      striker,
      nonStriker,
      totalBallsPlayed,
      bowler,
      currentRunRate,
      overs,
      isFirstInnings,
    } = this.props;
    return (
      <div className='ui segment container'>
        <div className='ui fluid card '>
          <div className='content center aligned'>
            <label className='header'>Scorecard</label>
          </div>
          <ScoreMainContainer>
            <ScoreGrid>
              <ScoreRow>
                <ScoreColumn className='score-label'>
                  <label className='ui big teal horizontal label'>Score</label>
                  <div className='ui compact menu'>
                    <label className='item'>
                      <div>{battingTeamScore || 0}</div>
                      <div className='floating ui red label'>
                        {battingTeamWickets || 0}
                      </div>
                    </label>
                  </div>
                </ScoreColumn>
                <ScoreColumn>
                  <div className='ui middle aligned divided list'>
                    <div className='item'>
                      <div className='right floated content'>
                        {striker.batting.runs || 0} (
                        {striker.batting.balls || 0} balls)
                      </div>
                      <i className='user circle icon'></i>
                      <div
                        className='content'
                        style={{ fontWeight: 'bolder', fontSize: '1.2rem' }}>
                        {striker.name}
                      </div>
                    </div>
                    <div className='item'>
                      <div className='right floated content'>
                        {nonStriker.batting.runs || 0} (
                        {nonStriker.batting.balls || 0} balls)
                      </div>
                      <i className='user circle icon'></i>
                      <div className='content'>{nonStriker.name}</div>
                    </div>
                  </div>
                </ScoreColumn>
              </ScoreRow>
              <ScoreRow>
                <ScoreColumn className='overs'>
                  {renderOvers('Overs', totalBallsPlayed || 0)}
                </ScoreColumn>
                <ScoreColumn className='bowler-score'>
                  <div className='ui middle aligned divided list'>
                    <div className='item'>
                      <div className='right floated content'>
                        {`${bowler.bowling.runs || 0}/${
                          bowler.bowling.wickets || 0
                        } `}
                        <div className='ui label tiny teal tag '>
                          {renderOvers('Overs', bowler.bowling.balls || 0)}
                        </div>
                      </div>
                      <i className='user circle icon'></i>
                      <div className='content'>{bowler.name}</div>
                    </div>
                  </div>
                </ScoreColumn>
              </ScoreRow>
            </ScoreGrid>
          </ScoreMainContainer>
          <ScoreMainContainer className='extra content'>
            <a href='/'>
              <FooterGrid>
                <FooterRow>
                  <FooterColumn>
                    {/* Projected score = currentRunRate*TotalOvers */}
                    <div>
                      {isFirstInnings ? (
                        <React.Fragment>
                          <label>
                            <i className='info circle icon'></i>Projected Score
                          </label>
                          {getProjectedScore(currentRunRate, overs)}
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <label>
                            <i className='info circle icon'></i>Required runs
                          </label>
                          {this.props.target}
                        </React.Fragment>
                      )}
                    </div>
                    <div>
                      <label>
                        <i className='info circle icon'></i>Balls left
                      </label>{' '}
                      {convertOversToBalls(this.props.overs) - totalBallsPlayed}
                    </div>
                  </FooterColumn>
                  <FooterColumn>
                    <div>
                      <label>
                        <i className='info circle icon'></i>Current Runrate
                      </label>{' '}
                      {currentRunRate}
                    </div>
                    <div>
                      <label>
                        <i className='info circle icon'></i>Required Runrate
                      </label>{' '}
                      {currentRunRate}
                    </div>
                  </FooterColumn>
                </FooterRow>
              </FooterGrid>
            </a>
          </ScoreMainContainer>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  battingTeamScore: selectBattingTeamScore,
  battingTeamWickets: selectBattingTeamWickets,
  isFirstInnings: selectIsFirstInnings,
  nonStriker: selectNonStriker,
  target: selectTarget,
  striker: selectStriker,
  bowler: selectBowler,
  overs: selectOvers,
  currentRunRate: selectCurrentRunRate,
  totalBallsPlayed: selectTotalBallsPlayed,
});

export default connect(mapStateToProps, {})(PlayScoreCard);
