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
    const { firstInnings } = this.props;
    this.setState({
      topTwoPlayers: trimObjectToTwo([...firstInnings.players]),
    });
  };
  render() {
    const { firstInnings, secondInnings, headerText } = this.props;
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
            <label className='heading'>{headerText}</label>
            <label className='sub-heading'>
              {this.state.open
                ? 'Click to return to summary'
                : 'Click to view full score card'}
            </label>
          </div>
          <div className='score-overs'>
            <div className='score'>
              {firstInnings.stats.totalRuns}/{firstInnings.stats.totalWickets}{' '}
              <label className='static'>
                overs: {convertBallsToOvers(firstInnings.stats.totalBalls)}
              </label>
            </div>
            <div className='overs'>
              <label className='static'>Extras: 5</label>
            </div>
          </div>
        </div>
        {!this.state.open ? (
          <div className='mini-content'>
            <div className='container'>
              <div className='batting'>
                <label className='team-name'>
                  {firstInnings.name}
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
                  <div className='player'>Bowler</div>
                  <div className='score'>
                    45/1 ({convertBallsToOvers(45)} ov)
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
                <label className='main-label'>{firstInnings.name} </label>
                <label className='sub-label'>(batting)</label>
              </div>
              <div className='score'>
                <div className='ui middle aligned divided list'>
                  {firstInnings.players
                    .sort((a, b) => a.order - b.order)
                    .map((player) => {
                      const {
                        batting: { runs, balls },
                      } = player;
                      return (
                        <div className='item' key={player.playerId}>
                          <div className='player'>
                            <div className='player-name'>{player.name}</div>
                            {/* <div className='player-status'>{player.status}</div> */}
                          </div>
                          <div className='player-score'>
                            {runs}({balls})
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            <div className='batting'>
              <div className='team-name'>
                <label className='main-label'>{secondInnings.name} </label>
                <label className='sub-label'>(bowling)</label>
              </div>
              <div className='score'>
                <div className='ui middle aligned divided list'>
                  {[...secondInnings.players]
                    .sort((a, b) => a.order - b.order)
                    .map((player) =>
                      player.bowling.balls ? (
                        <div className='item' key={player.playerId}>
                          <div className='player'>
                            <div className='player-name'>{player.name}</div>
                            <div className='player-status'>
                              {convertBallsToOvers(player.bowling.balls)}{' '}
                              over(s)
                            </div>
                          </div>
                          <div className='player-score'>
                            {player.bowling.runs}/{player.bowling.wickets}
                          </div>
                        </div>
                      ) : null
                    )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Accordion;
