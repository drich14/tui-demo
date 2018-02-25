import _ from 'lodash';
import gql from 'graphql-tag';
import parseCookies from './cookie';

export const getLoggedInUser = (context, apolloClient) =>
  parseCookies(context).token
    ? apolloClient
        .query({
          query: gql`
            query Me {
              me {
                id
              }
            }
          `
        })
        .then(({ data: { me } }) => ({ me }))
        .catch(() => ({ me: {} }))
    : { me: {} };

export const isLoggedIn = props => !_.isEmpty(props.me);
