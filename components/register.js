import React from 'react';
import { graphql, withApollo, compose } from 'react-apollo';
import cookie from 'cookie';
import Link from 'next/link';
import gql from 'graphql-tag';
import withData from '../lib/withData';
import redirect from '../lib/redirect';

const register = ({ registerMutation, onClick }) => (
  <div>
    <form onSubmit={registerMutation}>
      <input type="text" placeholder="Your Name" name="name" />
      <br />
      <input type="email" placeholder="Email" name="email" />
      <br />
      <input type="password" placeholder="Password" name="password" />
      <br />
      <button>Create account</button>
    </form>
    <hr />
    <button onClick={onClick}>
      <a>Sign in</a>
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
      mutation Register($email: String!, $password: String!) {
        signup(email: $email, password: $password) {
          token
        }
      }
    `,
    {
      name: 'register',
      // Apollo's way of injecting new props which are passed to the component
      props: ({ register, ownProps: { client } }) => ({
        // `create` is the name of the prop passed to the component
        registerMutation: event => {
          /* global FormData */
          const data = new FormData(event.target);

          event.preventDefault();
          event.stopPropagation();

          register({
            variables: {
              email: data.get('email'),
              password: data.get('password')
            }
          })
            .then(({ data: { signup: { token } } }) => {
              // Store the token in cookie
              document.cookie = cookie.serialize('token', token, {
                maxAge: 30 * 24 * 60 * 60 // 30 days
              });

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
              console.error(error); // TODO display errors
            });
        }
      })
    }
  )
)(register);
