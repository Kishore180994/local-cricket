import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { selectMatchId } from '../reducers/currentScore/currentScore.selectors';
import GoogleAuth from './GoogleAuth';

const Header = ({ matchId }) => {
  return (
    <div className='ui secondary pointing menu'>
      <Link to='/' className='item'>
        Cricket
      </Link>
      <div className='right menu'>
        <Link to={`/games/scorecard/${matchId}`} className='item'>
          Full Score Card
        </Link>
      </div>
      <GoogleAuth />
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  matchId: selectMatchId,
});

export default connect(mapStateToProps)(Header);
