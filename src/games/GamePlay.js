import './GameView.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  addScore,
  addWicket,
  undo,
  setOpen,
  setSelected,
  updateBatsmanScore,
} from '../actions';
import { Link } from 'react-router-dom';
import { isNumber } from 'lodash';
import Dropdown from '../components/Dropdown';
import {
  SELECT_RUNS_BYES,
  SELECT_RUNS_LEGBYES,
  SELECT_RUNS_NOBALL,
  SELECT_RUNS_WIDE,
  TOGGLE_OPEN_BYES,
  TOGGLE_OPEN_LEGBYES,
  TOGGLE_OPEN_NOBALL,
  TOGGLE_OPEN_WIDE,
} from '../actions/types';
import { createStructuredSelector } from 'reselect';
import {
  selectedByes,
  selectedLegByes,
  selectedNoBall,
  selectedWides,
  selectisByesOpen,
  selectislegByesOpen,
  selectisNoBallOpen,
  selectIsWideOpen,
} from '../reducers/dropDown/dropDown.selectors';
import {
  selectBattingTeamScore,
  selectBattingTeamWickets,
  selectBowler,
  selectIsByesEnabled,
  selectIsLegByesEnabled,
  selectIsNoBallEnabled,
  selectIsWidesEnabled,
  selectNonStriker,
  selectStriker,
  selectThisInnings,
  selectTotalBallsPlayed,
} from '../reducers/currentScore/currentScore.selectors';

class GamePlay extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  renderEx = (boolValue, ball, color, size) => {
    if (boolValue)
      return (
        <React.Fragment>
          {this.renderIcons(ball, color, size, null, 'big')}
        </React.Fragment>
      );
  };

  componentDidMount() {
    window.addEventListener('scroll', this.updateScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.updateScroll);
  }

  renderExtras = () => (
    <React.Fragment>
      {this.renderEx(this.props.isWidesEnabled, 'wd', 'orange', 'small')}
      {this.renderEx(this.props.isNoBallEnabled, 'nb', 'orange', 'small')}
      {this.renderEx(this.props.isByesEnabled, 'b', 'orange', 'small')}
      {this.renderEx(this.props.isLegByesEnabled, 'lb', 'orange', 'small')}
    </React.Fragment>
  );

  dropDownOptions = [
    { text: 'extra + 1 run', value: '1' },
    { text: 'extra + 2 run', value: '2' },
    { text: 'extra + 3 run', value: '3' },
    { text: 'extra + 4 run', value: '4' },
    { text: 'extra + 5 run', value: '5' },
    { text: 'extra + 6 run', value: '6' },
  ];

  renderIcons = (val, color, size, clickHandler, optional) => {
    const colorTag = `${color} ${optional} circle icon run`;
    const sizeTag = `${size} inverted icon run`;
    if (isNumber(val) || val === 'W') {
      return (
        <i
          className='big icons'
          onClick={() => {
            if (clickHandler) clickHandler(val);
          }}>
          <i className={colorTag}></i>
          <i className={sizeTag}>{val}</i>
        </i>
      );
    } else {
      // const isOpenProp = false;
      // const isSelectedProp = 0;
      // const buttonType = "";
      // const runType = "";

      // if (val === wd) {
      //   isOpenProp = this.props.isWideOpen;
      //   isSelectedProp = this.props.selectedWides;
      //   buttonType = TOGGLE_OPEN_WIDE;
      //   runType = SELECT_RUNS_WIDE;
      // }
      const isOpenProp =
        val === 'wd'
          ? this.props.isWideOpen
          : val === 'b'
          ? this.props.isByesOpen
          : val === 'nb'
          ? this.props.isNoBallOpen
          : val === 'lb'
          ? this.props.isLegByesOpen
          : '';

      const isSelectedProp =
        val === 'wd'
          ? this.props.selectedWides
          : val === 'b'
          ? this.props.selectedByes
          : val === 'nb'
          ? this.props.selectedNoBall
          : val === 'lb'
          ? this.props.selectedLegByes
          : '';

      const buttonType =
        val === 'wd'
          ? TOGGLE_OPEN_WIDE
          : val === 'b'
          ? TOGGLE_OPEN_BYES
          : val === 'nb'
          ? TOGGLE_OPEN_NOBALL
          : val === 'lb'
          ? TOGGLE_OPEN_LEGBYES
          : '';

      const runType =
        val === 'wd'
          ? SELECT_RUNS_WIDE
          : val === 'b'
          ? SELECT_RUNS_BYES
          : val === 'nb'
          ? SELECT_RUNS_NOBALL
          : val === 'lb'
          ? SELECT_RUNS_LEGBYES
          : '';

      return (
        <Dropdown
          val={val}
          setOpen={this.props.setOpen}
          isOpen={isOpenProp}
          options={this.dropDownOptions}
          buttonType={buttonType}
          runType={runType}
          selected={isSelectedProp}
          setSelected={this.props.setSelected}>
          <i className='big icons'>
            <i className={colorTag}></i>
            <i className={sizeTag}>{val}</i>
          </i>
        </Dropdown>
      );
    }
  };

  addScore = (run) => {
    this.props.addScore(run);
    this.props.updateBatsmanScore(run);
    this.updateScroll();
  };

  addWicket = () => {
    this.props.addWicket();
  };

  undoScore = () => {
    this.props.undo();
  };

  renderDivider() {
    return this.props.totalBallsPlayed % 6 === 0 ? <span>|</span> : '';
  }

  updateScroll() {
    // (TODO) Fix the update scroll
    if (this.myRef)
      this.myRef.current.scrollLeft = this.myRef.current.scrollWidth;
  }

  renderBalls() {
    return (
      <div className='ui segment container'>
        <div className='ui fluid card '>
          <div className='content center aligned'>
            <label className='header'>Current Ball</label>
            <div className='meta'>
              <span>Tap on score</span>
            </div>
            <div className='ui divider'></div>
            {this.renderIcons(0, '', '', this.addScore, 'big')}
            {this.renderIcons(1, '', '', this.addScore, 'big')}
            {this.renderIcons(2, '', '', this.addScore, 'big')}
            {this.renderIcons(3, '', '', this.addScore, 'big')}
            {this.renderIcons(4, '', '', this.addScore, 'big')}
            {this.renderIcons(6, '', '', this.addScore, 'big')}
            {this.renderExtras()}
            {this.renderIcons('W', 'red', null, this.addWicket, 'big')}
          </div>

          <div className='extra content scroll-parent'>
            <label className='ui large teal red ribbon label'>
              This Innings
            </label>
            <div ref={this.myRef} className='scroll'>
              <span className='ballScroll'>
                {this.props.thisOver
                  ? this.props.thisOver.map((value, id) => {
                      const color =
                        typeof value === 'number'
                          ? 'black'
                          : value === 'W'
                          ? 'red'
                          : 'orange';

                      return (
                        <span key={id}>
                          <label className={`ui ${color} circular label`}>
                            {value}
                          </label>
                        </span>
                      );
                    })
                  : null}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderOvers = (text, balls) => {
    const formatOvers = Math.trunc(balls / 6) + (balls % 6) / 10 || 0;
    return (
      <div className='item'>
        <label>{text}</label> {formatOvers}
      </div>
    );
  };

  renderScoreCard() {
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
                  {this.renderOvers('Overs', this.props.totalBallsPlayed || 0)}
                </div>
                <div className='column'>
                  <div className='ui middle aligned divided list'>
                    <div className='item'>
                      <div className='right floated content'>
                        {`${this.props.bowler.bowling.runs || 0}/${
                          this.props.bowler.bowling.wickets || 0
                        } `}
                        <div className='ui label tiny teal tag '>
                          {this.renderOvers(
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
                    {/*(TODO) "target for second innings"
                    "Projected target" for first innings" */}
                    <label>Target</label> 100
                    <div>
                      <i className='info circle icon'></i>
                      <label>Balls left</label> 62
                    </div>
                  </div>
                  <div className='column'>
                    <i className='info circle icon'></i>
                    <label>Current Runrate</label> 5
                    <div>
                      {/*(TODO) For second innings */}
                      <i className='info circle icon'></i>
                      <label>Required Runrate</label> 5
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

  renderLabel = (option) => ({
    color: option.color,
    content: option.text,
  });

  render() {
    return (
      <div>
        {this.renderBalls()}
        {this.renderScoreCard()}
        <button
          className='ui button right floated'
          onClick={() => {
            this.undoScore();
          }}>
          Undo
        </button>
        <Link to='/games/create' className='ui button right floated'>
          Create New Match
        </Link>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  isWidesEnabled: selectIsWidesEnabled,
  isNoBallEnabled: selectIsNoBallEnabled,
  isByesEnabled: selectIsByesEnabled,
  isLegByesEnabled: selectIsLegByesEnabled,
  isWideOpen: selectIsWideOpen,
  isNoBallOpen: selectisNoBallOpen,
  isLegByesOpen: selectislegByesOpen,
  isByesOpen: selectisByesOpen,
  selectedWides: selectedWides,
  selectedByes: selectedByes,
  selectedNoBall: selectedNoBall,
  selectedLegByes: selectedLegByes,
  battingTeamScore: selectBattingTeamScore,
  battingTeamWickets: selectBattingTeamWickets,
  thisOver: selectThisInnings,
  totalBallsPlayed: selectTotalBallsPlayed,
  nonStriker: selectNonStriker,
  striker: selectStriker,
  bowler: selectBowler,
});

export default connect(mapStateToProps, {
  addScore,
  addWicket,
  undo,
  setOpen,
  setSelected,
  updateBatsmanScore,
})(GamePlay);
