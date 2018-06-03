import React, { Component } from 'react';
import cookie from 'cookie';
import { deleteCookie } from '../lib/cookie';
import withData from '../lib/withData';
import redirect from '../lib/redirect';
import { getLoggedInUser, isLoggedIn } from '../lib/getLoggedInUser';
import Auth from '../components/auth';
import Link from 'next/link';

class Index extends Component {
  static getInitialProps = getLoggedInUser;

  signout = () => {
    deleteCookie();

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
        <Link href="/demo">demo</Link>
        <br />
        <button onClick={this.signout}>Sign out</button>
      </div>
    ) : (
      <Auth serverState={this.props.serverState || {}} />
    );
  }
}

export default withData(Index);
