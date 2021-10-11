import './HomePage.styles.scss';
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
          <i class='lock icon'></i>
          View Match
          <span className='small' style={{ fontSize: '0.7em' }}>
            {' '}
            (coming soon)
          </span>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
