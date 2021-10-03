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

class PlayScoreCard extends React.Component {
  render() {
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
                      <div>{this.props.battingTeamScore || 0}</div>
                      <div className='floating ui red label'>
                        {this.props.battingTeamWickets || 0}
                      </div>
                    </label>
                  </div>
                </ScoreColumn>
                <ScoreColumn>
                  <div className='ui middle aligned divided list'>
                    <div className='item'>
                      <div className='right floated content'>
                        {this.props.striker.batting.runs || 0} (
                        {this.props.striker.batting.balls || 0} balls)
                      </div>
                      <i className='user circle icon'></i>
                      <div
                        className='content'
                        style={{ fontWeight: 'bolder', fontSize: '1.2rem' }}>
                        {this.props.striker.name}
                      </div>
                    </div>
                    <div className='item'>
                      <div className='right floated content'>
                        {this.props.nonStriker.batting.runs || 0} (
                        {this.props.nonStriker.batting.balls || 0} balls)
                      </div>
                      <i className='user circle icon'></i>
                      <div className='content'>
                        {this.props.nonStriker.name}
                      </div>
                    </div>
                  </div>
                </ScoreColumn>
              </ScoreRow>
              <ScoreRow>
                <ScoreColumn className='overs'>
                  {renderOvers('Overs', this.props.totalBallsPlayed || 0)}
                </ScoreColumn>
                <ScoreColumn className='bowler-score'>
                  <div className='ui middle aligned divided list'>
                    <div className='item'>
                      <div className='right floated content'>
                        {`${this.props.bowler.bowling.runs || 0}/${
                          this.props.bowler.bowling.wickets || 0
                        } `}
                        <div className='ui label tiny teal tag '>
                          {renderOvers(
                            'Overs',
                            this.props.bowler.bowling.balls || 0
                          )}
                        </div>
                      </div>
                      <i className='user circle icon'></i>
                      <div className='content'>{this.props.bowler.name}</div>
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
                      <label>
                        <i className='info circle icon'></i>Projected Score
                      </label>{' '}
                      {getProjectedScore(
                        this.props.currentRunRate,
                        this.props.overs
                      )}
                    </div>
                    <div>
                      <label>
                        <i className='info circle icon'></i>Balls left
                      </label>{' '}
                      {convertOversToBalls(this.props.overs) -
                        this.props.totalBallsPlayed}
                    </div>
                  </FooterColumn>
                  <FooterColumn>
                    <div>
                      <label>
                        <i className='info circle icon'></i>Current Runrate
                      </label>{' '}
                      {this.props.currentRunRate}
                    </div>
                    <div>
                      {/*(TODO) For second innings */}
                      {/* Wickets Remaining */}
                      {/* <label>
                        <i className='info circle icon'></i>[Remove]Required
                        Runrate
                      </label>{' '}
                      5Wickets Remaining */}
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
  nonStriker: selectNonStriker,
  striker: selectStriker,
  bowler: selectBowler,
  overs: selectOvers,
  currentRunRate: selectCurrentRunRate,
  totalBallsPlayed: selectTotalBallsPlayed,
});

export default connect(mapStateToProps, {})(PlayScoreCard);
