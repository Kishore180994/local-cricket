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
        {/* <Link to='/' className=''>
          Live Match
        </Link> */}
      </div>
    </div>
  );
};

export default HomePage;
