import React from 'react';
import { graphql, withApollo, compose } from 'react-apollo';
import cookie from 'cookie';
import Link from 'next/link';
import gql from 'graphql-tag';
import withData from '../lib/withData';
import redirect from '../lib/redirect';
import { setCookie } from '../lib/cookie';

const login = ({ loginMutation, onClick }) => (
  <div>
    <form onSubmit={loginMutation}>
      <input type="email" placeholder="Email" name="email" />
      <br />
      <input type="password" placeholder="Password" name="password" />
      <br />
      <button>Login</button>
    </form>
    <hr />
    <button onClick={onClick}>
      <a>Register</a>
    </button>
  </div>
);

export default compose(
  // withData gives us server-side graphql queries before rendering
  withData,
  // withApollo exposes `this.props.client` used when logging out
  withApollo,
  graphql(
    gql`
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user {
            id
          }
        }
      }
    `,
    {
      name: 'login',
      // Apollo's way of injecting new props which are passed to the component
      props: ({ login, ownProps: { client } }) => ({
        // `signin` is the name of the prop passed to the component
        loginMutation: event => {
          /* global FormData */
          const data = new FormData(event.target);

          event.preventDefault();
          event.stopPropagation();

          login({
            variables: {
              email: data.get('email'),
              password: data.get('password')
            }
          })
            .then(({ data: { login: { token, user: { id } } } }) => {
              // Store the token in cookie
              setCookie(token, id);

              // Force a reload of all the current queries now that the user is
              // logged in
              client.resetStore().then(() => {
                // Now redirect to the homepage
                redirect({}, '/');
              });
            })
            .catch(error => {
              // Something went wrong, such as incorrect password, or no network
              // available, etc.
              console.error(error);
            });
        }
      })
    }
  )
)(login);
