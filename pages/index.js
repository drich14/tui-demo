import React from 'react';
import cookie from 'cookie';
import { withApollo, compose } from 'react-apollo';
import withData from '../lib/withData';
import redirect from '../lib/redirect';
import { getLoggedInUser, isLoggedIn } from '../lib/getLoggedInUser';
import Auth from '../components/auth';

class Index extends React.Component {
  static getInitialProps = getLoggedInUser;

  signout = () => {
    document.cookie = cookie.serialize('token', '', {
      maxAge: -1 // Expire the cookie immediately
    });

    // Force a reload of all the current queries now that the user is
    // logged in, so we don't accidentally leave any state around.
    this.props.client.cache.reset().then(() => {
      // Redirect to a more useful page when signed out
      redirect({}, '/');
    });
  };

  render() {
    return isLoggedIn(this.props) ? (
      <div>
        Hello {this.props.me.id}!<br />
        <button onClick={this.signout}>Sign out</button>
      </div>
    ) : (
      <Auth serverState={this.props.serverState || {}} />
    );
  }
}

export default compose(withData, withApollo)(Index);
