import './GameCreate.css';
import { Component } from 'react';
import { Form, Field } from 'react-final-form';
import { connect } from 'react-redux';
import { createGame, selectExtras, selectWides } from '../actions';
import MatchSettings from './MatchSettings';
import history from '../history';

class GameCreate extends Component {
  onFormSubmit = async (formValues) => {
    const matchId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    await this.props.createGame({ ...formValues, matchId });
    history.push(`/games/view/${matchId}`);
  };

  renderError = ({ error, touched }) => {
    if (error && touched) {
      return <div>{error}</div>;
    }
    return <div></div>;
  };

  renderInput = ({ input, label, meta }) => {
    const className = `field ${meta.active ? 'active' : ''} ${
      meta.error && meta.touched ? 'error' : ''
    }`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input {...input} />
        <label>{this.renderError(meta)}</label>
      </div>
    );
  };

  renderSelect = ({ input, label, options, meta }) => {
    return (
      <div className='field'>
        <label>{label}</label>
        <select {...input} onChange={(value) => input.onChange(value)}>
          <option />
          {Object.keys(options).map((key) => {
            return (
              <option value={key} key={key}>
                {options[key]}
              </option>
            );
          })}
        </select>
        <label>{this.renderError(meta)}</label>
      </div>
    );
  };

  renderCheck = ({ input, label, showOptions, val, change }) => {
    const renderInput = change ? (
      <input
        {...input}
        checked={val}
        onChange={(value) => showOptions(value)}
      />
    ) : (
      <input {...input} checked={val} />
    );
    return (
      <div className='ui left aligned field'>
        <div className='ui toggle checkbox'>
          {renderInput}
          <label>{label}</label>
        </div>
      </div>
    );
  };

  clearAllForms = () => {
    this.props.selectExtras(false);
    this.props.selectWides(false);
  };

  validate = (formValues) => {
    const errors = {};
    if (!formValues.team1) errors.team1 = 'You must enter Team1 Name.';
    if (!formValues.team2) errors.team2 = 'You must enter Team2 Name.';
    if (!formValues.toss) errors.toss = 'You must decide the toss.';
    if (!formValues.choose)
      errors.choose = 'Team who won toss decide Batting or Bowling.';
    if (!formValues.overs) errors.overs = 'You must enter the number of overs.';
    return errors;
  };

  render() {
    return (
      <Form onSubmit={this.onFormSubmit} validate={this.validate}>
        {({ handleSubmit, form, values }) => (
          <form className='ui form container' onSubmit={handleSubmit}>
            <label className='ui header center aligned container'>
              Match Settings
            </label>
            <div className='field'>
              <Field
                className='item'
                name='team1'
                type='text'
                label='Enter Team1'
                component={this.renderInput}
              />
              <Field
                className='item'
                name='team2'
                type='text'
                label='Enter Team2'
                component={this.renderInput}>
                {/* {(fieldState) => (
                  <pre>{JSON.stringify(fieldState, undefined, 2)}</pre>
                )} */}
              </Field>
              <Field
                name='toss'
                label='Who won the toss?'
                options={{ team1: 'Team1', team2: 'Team2' }}
                component={this.renderSelect}>
                {/* {(fieldState) => (
                  <pre>{JSON.stringify(fieldState, undefined, 2)}</pre>
                )} */}
              </Field>
              <Field
                name='choose'
                label='Choose Batting/Bowling'
                options={{ batting: 'Batting', bowling: 'Bowling' }}
                component={this.renderSelect}
              />
              <MatchSettings
                Field={Field}
                form={form}
                renderCheck={this.renderCheck}
                renderInput={this.renderInput}
              />
              {/* <pre>{JSON.stringify(values, undefined, 2)}</pre> */}
              <div className='button-container'>
                <button
                  className='ui button negative four wide column'
                  onClick={() => {
                    form.reset();
                    this.clearAllForms();
                  }}>
                  clear
                </button>
                <button
                  className='ui button primary four wide column'
                  type='submit'>
                  Submit
                </button>
              </div>
            </div>
          </form>
        )}
      </Form>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     curMatchId: state.curScore.matchId,
//   };
// };
export default connect(null, {
  createGame,
  selectExtras,
  selectWides,
})(GameCreate);
