import React from 'react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../Modal';
import { Form, Field } from 'react-final-form';
import { connect } from 'react-redux';
import { addStriker, addNonStriker, addBowler } from '../actions';
import history from '../history';
import { createStructuredSelector } from 'reselect';
import {
  selectBattingTeam,
  selectBowlingTeam,
} from '../reducers/currentScore/currentScore.selectors';
import RenderInput from './render-input/render-input.component';

class GameView extends React.Component {
  state = {
    striker: {
      value: '',
      touched: false,
    },
    nonStriker: {
      value: '',
      touched: false,
    },
    bowler: {
      value: '',
      touched: false,
    },
  };

  renderActions() {
    const { striker, nonStriker, bowler } = this.state;
    let isValuesFilled = striker.value && nonStriker.value && bowler.value;
    const submitClass = `ui button green ${isValuesFilled ? '' : 'disabled'}`;
    return (
      <Fragment>
        <button onClick={() => this.onSubmit()} className={submitClass}>
          Start Match
        </button>
        <Link to='/games/create' className='ui button negative'>
          Cancel
        </Link>
      </Fragment>
    );
  }

  onSubmit = () => {
    const { id } = this.props.match.params;
    this.props.addStriker(this.state.striker.value);
    this.props.addNonStriker(this.state.nonStriker.value);
    this.props.addBowler(this.state.bowler.value);
    history.push(`/games/play/${id}`);
  };

  renderContent() {
    const { battingTeam, bowlingTeam } = this.props;
    const { striker, nonStriker, bowler } = this.state;
    const battingTeamPlayers = battingTeam.players;
    const bowlingTeamPlayers = bowlingTeam.players;

    return (
      <Fragment>
        <RenderInput
          label='Striker'
          placeholder='Enter new or select batsman'
          options={battingTeamPlayers.filter(
            (player) => player.batting.status !== 'OUT'
          )}
          value={this.state.striker.value}
          onValueChange={(e) =>
            this.setState({ striker: { ...striker, value: e.target.value } })
          }
          error={!striker.value && striker.touched ? true : false}
          onBlurField={() =>
            this.setState({ striker: { ...striker, touched: true } })
          }
          dropDownPlaceHolder='Enter new Batsman name!'
          modalType='batsman'
          required
        />
        <RenderInput
          label='Non Striker'
          placeholder='Enter new or select batsman'
          options={battingTeamPlayers.filter(
            (player) => player.batting.status !== 'OUT'
          )}
          error={!nonStriker.value && nonStriker.touched ? true : false}
          value={this.state.nonStriker.value}
          onValueChange={(e) =>
            this.setState({
              nonStriker: { ...nonStriker, value: e.target.value },
            })
          }
          onBlurField={() =>
            this.setState({ nonStriker: { ...nonStriker, touched: true } })
          }
          dropDownPlaceHolder='Enter new Batsman name!'
          modalType='batsman'
          required
        />
        <RenderInput
          label='Bowler'
          placeholder='Enter new or select bowler'
          options={bowlingTeamPlayers}
          value={this.state.bowler.value}
          error={!bowler.value && bowler.touched ? true : false}
          onValueChange={(e) =>
            this.setState({ bowler: { ...bowler, value: e.target.value } })
          }
          onBlurField={() =>
            this.setState({ bowler: { ...bowler, touched: true } })
          }
          dropDownPlaceHolder='Enter new bowler name!'
          modalType='bowler'
          required
        />
      </Fragment>
    );
  }

  render() {
    return (
      <Modal
        header='Add player details'
        content={this.renderContent()}
        actions={this.renderActions()}
      />
    );
  }
}

const mapStateToProps = createStructuredSelector({
  battingTeam: selectBattingTeam,
  bowlingTeam: selectBowlingTeam,
});

export default connect(mapStateToProps, {
  addStriker,
  addNonStriker,
  addBowler,
})(GameView);
