import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import WithSpinner from '../../components/with-spinner/with-spinner.component';
import { selectIsFirstInningsFinished } from '../../reducers/currentScore/currentScore.staticSelectors';

import GameView from './game-view.component';

const mapStateToProps = createStructuredSelector({
  isLoading: (state) => !selectIsFirstInningsFinished(state),
});

const GameViewContainer = compose(
  connect(mapStateToProps),
  WithSpinner
)(GameView);

export default GameViewContainer;
