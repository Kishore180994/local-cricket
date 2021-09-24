import { Component } from "react";
import { connect } from "react-redux";

import { signIn, signOut } from "../actions";

class GoogleAuth extends Component {
  componentDidMount() {
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          clientId:
            "593501238440-htv0ckinlh6nbnebc1048pobm8uah01b.apps.googleusercontent.com",
          scope: "email",
        })
        .then(() => {
          this.auth = window.gapi.auth2.getAuthInstance();
          this.onAuthChange(this.auth.isSignedIn.get());
          this.auth.isSignedIn.listen(this.onAuthChange);
        });
    });
  }

  onAuthChange = (isSignedIn) => {
    if (isSignedIn) this.props.signIn(this.auth.currentUser.get().getId());
    else {
      this.props.signOut();
    }
  };

  onSignInClick = () => {
    this.auth.signIn();
  };

  onSignOutClick = () => {
    this.auth.signOut();
  };

  renderButton() {
    if (this.props.isSignedIn == null) return null;
    else if (this.props.isSignedIn)
      return (
        <div>
          <button
            className="ui red google button"
            onClick={() => this.onSignOutClick()}
          >
            <i className="google icon" />
            Sign out
          </button>
        </div>
      );
    else
      return (
        <div>
          <button
            className="ui green google button"
            onClick={() => this.onSignInClick()}
          >
            <i className="google icon" />
            Sign in
          </button>
        </div>
      );
  }

  render() {
    return <div>{this.renderButton()}</div>;
  }
}

const mapStateToProps = (state) => {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);
