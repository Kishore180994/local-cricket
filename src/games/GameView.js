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

class GameView extends React.Component {
  renderActions() {
    return (
      <Fragment>
        <button type='submit' form='myForm' className='ui button green'>
          Start Match
        </button>
        <Link to='/games/create' className='ui button negative'>
          Cancel
        </Link>
      </Fragment>
    );
  }

  renderError = ({ error, touched }) => {
    if (touched && error) {
      return (
        <div className='ui error message'>
          <div className='header'>{error}</div>
        </div>
      );
    }
  };

  renderInput = ({ input, label, meta }) => {
    const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input {...input} />
        {this.renderError(meta)}
      </div>
    );
  };

  onSubmit = (formValues) => {
    const { id } = this.props.match.params;
    this.props.addStriker(formValues.striker);
    this.props.addNonStriker(formValues.nonStriker);
    this.props.addBowler(formValues.bowler);
    history.push(`/games/play/${id}`);
  };

  renderContent() {
    return (
      <Fragment>
        <Form
          onSubmit={this.onSubmit}
          validate={(formValues) => {
            const errors = {};

            if (!formValues.striker) {
              errors.striker = 'Enter Batsman Name.';
            }

            if (!formValues.nonStriker) {
              errors.nonStriker = 'Enter Batsman Name.';
            }

            if (!formValues.bowler) {
              errors.bowler = 'Enter Bowler Name.';
            }

            return errors;
          }}
          render={({ handleSubmit }) => (
            <form id='myForm' onSubmit={handleSubmit} className='ui form error'>
              <Field
                name='striker'
                component={this.renderInput}
                label='Enter Striker Name'
                playerType='batting'
              />
              <Field
                name='nonStriker'
                component={this.renderInput}
                label='Enter Non-striker Name'
                playerType='batting'
              />
              <Field
                name='bowler'
                component={this.renderInput}
                label='Enter Bowler Name'
                playerType='batting'
              />
            </form>
          )}
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
