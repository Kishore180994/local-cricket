import React from 'react';
import { convertBallsToOvers } from '../../util';
import './accordion.styles.scss';
import { trimObjectToTwo } from './accordion.utils';

class Accordion extends React.Component {
  state = {
    open: false,
    topTwoPlayers: [],
  };

  componentDidMount() {
    this.topTwoPlayers();
  }

  topTwoPlayers = () => {
    const {
      striker,
      nonStriker,
      innings: { players },
    } = this.props;
    this.setState({
      topTwoPlayers: trimObjectToTwo([...players, striker, nonStriker]),
    });
  };
  render() {
    const {
      bowler,
      innings: {
        name,
        toss,
        choose,
        players,
        stats: { totalRuns, totalWickets, totalBalls, thisOver },
      },
    } = this.props;
    return (
      <div className='scorecard-container'>
        <div
          className='main-header'
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ open: !this.state.open });
          }}>
          <div className='skew-back'>
            {/* <i className='angle right icon'></i> */}
            <label className='heading'>{'First Innings'}</label>
            <label className='sub-heading'>Click to view full score card</label>
          </div>
          <div className='score-overs'>
            <div className='score'>
              {totalRuns}/{totalWickets} <label className='static'>score</label>
            </div>
            <div className='overs'>
              {convertBallsToOvers(totalBalls)}{' '}
              <label className='static'>overs</label>
            </div>
          </div>
        </div>

        {!this.state.open ? (
          <div className='mini-content'>
            <div className='container'>
              <div className='batting'>
                <label className='team-name'>
                  {name}
                  <label className='team-name-sub'>(batting)</label>
                </label>
                {this.state.topTwoPlayers.map((player) => (
                  <div className='item' key={player.playerId}>
                    <div className='player'>{player.name}</div>
                    <div className='score'>
                      {player.batting.runs}({player.batting.balls})
                    </div>
                  </div>
                ))}
              </div>
              <div className='bowling'>
                <label className='team-name'>Bowling</label>
                <div className='item'>
                  <div className='player'>{bowler.name}</div>
                  <div className='score'>
                    {bowler.bowling.runs}/{bowler.bowling.wickets} (
                    {convertBallsToOvers(bowler.bowling.balls)} ov)
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {this.state.open ? (
          <div className='content'>
            <div className='batting'>
              <div className='team-name'>
                <label className='main-label'>Team1</label>
              </div>
              <div className='score'>
                <div className='ui middle aligned divided list'>
                  <div className='item'>
                    <div className='player'>
                      <div className='player-name'>Sachin</div>
                      <div className='player-status'>Not out</div>
                    </div>
                    <div className='player-score'>234(84)</div>
                  </div>
                  <div className='item'>
                    <div className='player'>
                      <div className='player-name'>Sehwag</div>
                      <div className='player-status'>Not out</div>
                    </div>
                    <div className='player-score'>234(84)</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='bowling'></div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Accordion;
