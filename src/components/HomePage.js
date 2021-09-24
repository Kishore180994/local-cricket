import "./HomePage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="my-container">
      <h2 className="ui center aligned icon header column">
        <i className="circular users icon" />
        <label>Cricket</label>
      </h2>
      <div className="buttonCenter">
        <Link to="/" className="ui button grey">
          Open Group
        </Link>
        <Link to="/games/create" className="ui button primary">
          Quick Match
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
