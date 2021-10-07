import React from 'react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../Modal';
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
      objectData: null,
    },
    nonStriker: {
      value: '',
      touched: false,
      objectData: null,
    },
    bowler: {
      value: '',
      touched: false,
      objectData: null,
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
    const { addStriker, addNonStriker, addBowler } = this.props;
    const { striker, nonStriker, bowler } = this.state;
    if (striker.objectData) addStriker(striker.objectData);
    else addStriker(striker.value);
    if (nonStriker.objectData) addNonStriker(nonStriker.objectData);
    else addNonStriker(nonStriker.value);
    if (bowler.objectData) addBowler(bowler.objectData);
    else addBowler(bowler.value);
    history.push(`/games/play/${id}`);
  };

  onValueChange = (text, stringOrObject, fieldType, stateField) => {
    if (text) this.setState({ [fieldType]: { ...stateField, value: text } });
    else if (typeof stringOrObject === 'object')
      this.setState({
        [fieldType]: {
          ...stateField,
          objectData: stringOrObject,
          value: stringOrObject.name,
        },
      });
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
          onValueChange={(e, obj) =>
            this.onValueChange(e.target.value, obj, 'striker', striker)
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
          onValueChange={(e, obj) =>
            this.onValueChange(e.target.value, obj, 'nonStriker', nonStriker)
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
          onValueChange={(e, obj) =>
            this.onValueChange(e.target.value, obj, 'bowler', bowler)
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
