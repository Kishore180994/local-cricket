import './GameCreate.css';
import { Component } from 'react';
import { Form, Field } from 'react-final-form';
import { connect } from 'react-redux';
import { createGame, selectExtras, selectWides } from '../actions';
import MatchSettings from './MatchSettings';
import history from '../history';

class GameCreate extends Component {
  componentDidMount() {
    window.addEventListener('popstate', () => {
      history.go(1);
    });
  }
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
    if (!formValues.firstTeam) errors.firstTeam = 'You must enter Team1 Name.';
    if (!formValues.secondTeam)
      errors.secondTeam = 'You must enter Team2 Name.';
    if (!formValues.toss) errors.toss = 'You must decide the toss.';
    if (!formValues.choose)
      errors.choose = 'Team who won toss decide Batting or Bowling.';
    if (!formValues.overs) errors.overs = 'You must enter the number of overs.';
    return errors;
  };

  initialData = {
    firstTeam: 'Sky Eagles',
    secondTeam: 'Red Flames',
    overs: 6,
    wpr: 1,
    noball: true,
    byes: true,
    legbyes: true,
  };

  render() {
    return (
      <div style={{ margin: '10% 0' }}>
        <Form
          onSubmit={this.onFormSubmit}
          validate={this.validate}
          initialValues={this.initialData}>
          {({ handleSubmit, form, values }) => (
            <form className='ui form container' onSubmit={handleSubmit}>
              <label className='ui header center aligned container'>
                Match Settings
              </label>
              <div className='field'>
                <Field
                  className='item'
                  name='firstTeam'
                  type='text'
                  label='Enter Team1'
                  component={this.renderInput}
                />
                <Field
                  className='item'
                  name='secondTeam'
                  type='text'
                  label='Enter Team2'
                  component={this.renderInput}>
                  )} */}
                </Field>
                <Field
                  name='toss'
                  label='Who won the toss?'
                  options={{ firstTeam: 'Team1', secondTeam: 'Team2' }}
                  component={this.renderSelect}>
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
                <div className='button-container'>
                  <button
                    className='ui button negative'
                    onClick={() => {
                      form.reset();
                      this.clearAllForms();
                    }}>
                    clear
                  </button>
                  <button className='ui button primary' type='submit'>
                    Submit
                  </button>
                </div>
              </div>
            </form>
          )}
        </Form>
      </div>
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
