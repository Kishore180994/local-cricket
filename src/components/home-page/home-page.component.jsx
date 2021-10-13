import './home-page.styles.scss';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className='my-container'>
      <h2 className='ui center aligned icon header column'>
        {/* <i className='circular users icon' /> */}
        <label className='app-name'>
          <span className='big'>CricScore</span>
          <span className='small'>App.com</span>
        </label>
      </h2>
      <div className='buttonCenter'>
        <Link to='/games/create' className='button'>
          Quick Match
        </Link>
      </div>
      <div className='buttonCenter'>
        <Link to='/' className='button disabled-link'>
          <i className='lock icon'></i>
          View Match
          <span className='small' style={{ fontSize: '0.7em' }}>
            {' '}
            (coming soon)
          </span>
        </Link>
      </div>
      <label
        style={{
          position: 'absolute',
          height: '100px',
          color: 'white',
          fontSize: '0.6rem',
          top: 0,
        }}>
        *Use mobile phone for best experience*
      </label>
      <div className='blocks a'></div>
      <div className='blocks c'></div>
      <div className='blocks b'></div>
      <div className='cricket-ball'></div>
    </div>
  );
};

export default HomePage;
