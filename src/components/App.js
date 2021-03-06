import { Route, Router, Switch } from 'react-router-dom';
import history from '../history';
import GameCreate from '../games/GameCreate';
import GamePlay from '../games/game-play/game-play.component';
import FullScoreCard from '../games/full-score-card/full-score-card.component';
import { createStructuredSelector } from 'reselect';
import { selectMatchId } from '../reducers/currentScore/currentScore.selectors';
import { connect } from 'react-redux';
import HomePage from './home-page/home-page.component';
import styled from 'styled-components';
import PageNotFound from './page-not-found/page-not-found.component';
import Header from './header/header.component';
import GameView from '../games/game-view/game-view.component';

const MainContainer = styled.div`
  overflow: hidden;
`;
function App({ matchId }) {
  return (
    <MainContainer className='ui component'>
      <Router history={history}>
        <div>
          {matchId ? <Header /> : null}
          <Switch>
            <Route
              path='/'
              exact
              render={() => (matchId ? <GamePlay /> : <HomePage />)}
            />
            <Route path='/games/create' exact component={GameCreate} />
            <Route path='/games/view/:id' exact component={GameView} />
            <Route path='/games/play/:id' exact component={GamePlay} />
            <Route
              path='/games/scorecard/:id'
              exact
              component={FullScoreCard}
            />
            <Route component={PageNotFound} />
          </Switch>
        </div>
      </Router>
    </MainContainer>
  );
}

const mapStateToProps = createStructuredSelector({
  matchId: selectMatchId,
});

export default connect(mapStateToProps)(App);
