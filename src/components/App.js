import { Route, Router, Switch } from 'react-router-dom';
import Header from './Header';
import HomePage from './HomePage';
import history from '../history';
import GameCreate from '../games/GameCreate';
import GameView from '../games/GameView';
import GamePlay from '../games/game-play/game-play.component';

function App() {
  return (
    <div className='ui component'>
      <Router history={history}>
        <div>
          <Header />
          <Switch>
            <Route path='/' exact component={HomePage} />
            <Route path='/games/create' component={GameCreate} />
            <Route path='/games/view/:id' component={GameView} />
            <Route path='/games/play/:id' component={GamePlay} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
