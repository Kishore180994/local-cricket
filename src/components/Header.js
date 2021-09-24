import { Link } from "react-router-dom";
import GoogleAuth from "./GoogleAuth";

const Header = () => {
  return (
    <div className="ui secondary pointing menu">
      <Link to="/" className="item">
        Cricket
      </Link>
      <div className="right menu">
        <Link to="/" className="item">
          All Games
        </Link>
      </div>
      <GoogleAuth />
    </div>
  );
};

export default Header;
