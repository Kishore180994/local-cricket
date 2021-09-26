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
          <div className='item content container'>
            <div className=' ui two column grid'>
              <div className='row'>
                <div className='column'>
                  <label className='ui big teal horizontal label'>Score</label>
                  <div className='ui compact menu'>
                    <label className='item'>
                      <div>{this.props.battingTeamScore || 0}</div>
                      <div className='floating ui red label'>
                        {this.props.battingTeamWickets || 0}
                      </div>
                    </label>
                  </div>
                </div>
                <div className='column'>
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
                </div>
              </div>
              <div className='row'>
                <div className='column'>
                  {renderOvers('Overs', this.props.totalBallsPlayed || 0)}
                </div>
                <div className='column'>
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
                </div>
              </div>
            </div>
          </div>
          <div className='extra content'>
            <a href='/'>
              <div className=' ui two column grid'>
                <div className='row'>
                  <div className='column'>
                    <i className='info circle icon'></i>
                    {/* Projected score = currentRunRate*TotalOvers */}
                    <label>Projected Score</label>{' '}
                    {getProjectedScore(
                      this.props.currentRunRate,
                      this.props.overs
                    )}
                    <div>
                      <i className='info circle icon'></i>
                      <label>Balls left</label>{' '}
                      {convertOversToBalls(this.props.overs) -
                        this.props.totalBallsPlayed}
                    </div>
                  </div>
                  <div className='column'>
                    <i className='info circle icon'></i>
                    <label>Current Runrate</label> {this.props.currentRunRate}
                    <div>
                      {/*(TODO) For second innings */}
                      {/* Wickets Remaining */}
                      <i className='info circle icon'></i>
                      <label>[Remove]Required Runrate</label> 5
                      {/* Wickets Remaining */}
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
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
