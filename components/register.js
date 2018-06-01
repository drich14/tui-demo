import React from 'react';
import { graphql, withApollo, compose } from 'react-apollo';
import cookie from 'cookie';
import Link from 'next/link';
import gql from 'graphql-tag';
import withData from '../lib/withData';
import redirect from '../lib/redirect';
import { setCookie } from '../lib/cookie';

const Register = ({ registerMutation, onClick }) => (
  <div>
    <form onSubmit={registerMutation}>
      <input
        type="email"
        placeholder="Email"
        name="email"
        autoComplete="email"
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        name="password"
        autoComplete="new-password"
      />
      <br />
      <button>Register</button>
    </form>
    <hr />
    <button onClick={onClick}>
      <a>Login</a>
    </button>
  </div>
);

const registerMutation = gql`
  mutation Register($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      token
      user {
        id
      }
    }
  }
`;

const registerOptions = {
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
        .then(({ data: { signup: { token, user: { id } } } }) => {
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
          console.error(error); // TODO display errors
        });
    }
  })
};

export default withData(Register, registerMutation);
