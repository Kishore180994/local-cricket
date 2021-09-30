import { Route, Router, Switch } from 'react-router-dom';
import Header from './Header';
import HomePage from './HomePage';
import history from '../history';
import GameCreate from '../games/GameCreate';
import GameView from '../games/GameView';
import GamePlay from '../games/game-play/game-play.component';
import FullScoreCard from '../games/full-score-card/full-score-card.component';
import { createStructuredSelector } from 'reselect';
import { selectMatchId } from '../reducers/currentScore/currentScore.selectors';
import { connect } from 'react-redux';

function App({ matchId }) {
  return (
    <div className='ui component'>
      <Router history={history}>
        <div>
          <Header />
          <Switch>
            <Route
              path='/'
              exact
              render={() => (matchId ? <GamePlay /> : <HomePage />)}
            />
            <Route
              path='/games/create'
              exact
              render={() => (matchId ? <GamePlay /> : <GameCreate />)}
            />
            <Route path='/games/view/:id' exact component={GameView} />
            <Route path='/games/play/:id' component={GamePlay} />
            <Route path='/games/scorecard/:id' component={FullScoreCard} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  matchId: selectMatchId,
});

export default connect(mapStateToProps)(App);
