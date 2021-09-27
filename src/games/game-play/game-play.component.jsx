import '../GameView.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  addScore,
  undo,
  setOpen,
  setSelected,
  setWicketModal,
  swapStriker,
} from '../../actions';
import { Link } from 'react-router-dom';
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
} from '../../reducers/dropDown/dropDown.selectors';
import {
  selectIsByesEnabled,
  selectIsLegByesEnabled,
  selectIsNoBallEnabled,
  selectIsWidesEnabled,
  selectThisInnings,
  selectTotalBallsPlayed,
} from '../../reducers/currentScore/currentScore.selectors';
import { selectWicketModalHiddenValue } from '../../reducers/modal/modal.selectors';
import WicketModal from '../wicket-modal/wicket.modal';
import { renderExtras, renderIcons, updateScroll } from './game-play.utils';
import PlayScoreCard from '../score-card/play-score-card.component';
import {
  BOWLED,
  CAUGHT_OUT,
  HIT_WICKET,
  LBW,
  RETIRED_HURT,
  RUN_OUT,
  STUMP_OUT,
} from '../../actions/types';

class GamePlay extends Component {
  constructor() {
    super();
    this.myRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('scroll', this.updateScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.updateScroll);
  }

  addScore = (run) => {
    this.props.addScore(run).then(() => {
      const overEnd = this.props.totalBallsPlayed % 6;
      if (!overEnd || run === 1 || run === 3) this.props.swapStriker(run);
    });
    updateScroll(this.myRef);
  };

  addWicket = (type) => {
    this.props.setWicketModal(false, type);
  };

  renderDivider() {
    return this.props.totalBallsPlayed % 6 === 0 ? <span>|</span> : '';
  }

  renderWickets = () => (
    <div className='wickets'>
      <div className='header'>Wickets</div>
      <div className='ui buttons'>
        <div className='buttons-container'>
          <button
            className='ui button custom'
            onClick={() => this.addWicket(BOWLED)}>
            Bowled
          </button>
          <button
            className='ui button custom'
            onClick={() => this.addWicket(CAUGHT_OUT)}>
            Caught
          </button>
          <button
            className='ui button custom'
            onClick={() => this.addWicket(HIT_WICKET)}>
            Hit Wicket
          </button>
          <button
            className='ui button custom'
            onClick={() => this.addWicket(LBW)}>
            LBW
          </button>
          <button
            className='ui button custom'
            onClick={() => this.addWicket(RUN_OUT)}>
            Run out
          </button>
          <button
            className='ui button custom'
            onClick={() => this.addWicket(STUMP_OUT)}>
            Stumped
          </button>
          <button
            className='ui button orange'
            onClick={() => this.addWicket(RETIRED_HURT)}>
            Retired Hurt
          </button>
        </div>
      </div>
    </div>
  );

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
            {renderIcons(0, '', '', this.addScore, 'big', this.props)}
            {renderIcons(1, '', '', this.addScore, 'big', this.props)}
            {renderIcons(2, '', '', this.addScore, 'big', this.props)}
            {renderIcons(3, '', '', this.addScore, 'big', this.props)}
            {renderIcons(4, '', '', this.addScore, 'big', this.props)}
            {renderIcons(6, '', '', this.addScore, 'big', this.props)}
            {renderExtras(this.props)}
            {/* {this.renderIcons('W', 'red', null, this.addWicket, 'big')} */}
          </div>
          <div>{this.renderWickets()}</div>
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

  render() {
    const { isWicketModalHidden } = this.props;
    return (
      <React.Fragment>
        {isWicketModalHidden ? null : <WicketModal />}
        <div>
          {this.renderBalls()}
          <PlayScoreCard />
          <button
            className='ui button right floated'
            onClick={() => {
              this.props.undo();
            }}>
            Undo
          </button>
          <Link to='/games/create' className='ui button right floated'>
            Create New Match
          </Link>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  isWicketModalHidden: selectWicketModalHiddenValue,
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
  thisOver: selectThisInnings,
  totalBallsPlayed: selectTotalBallsPlayed,
});

export default connect(mapStateToProps, {
  addScore,
  undo,
  setOpen,
  setSelected,
  setWicketModal,
  swapStriker,
})(GamePlay);