import { serialize, parse } from 'cookie';
import env from './env';

export const getCookie = (context = {}, options = {}) => {
  const cookie = parse(
    !process.browser || (context.req && context.req.headers.cookie)
      ? context.req.headers.cookie || ''
      : document.cookie,
    options
  );

  if (!cookie || !cookie[env.COOKIE_TOKEN]) {
    // || !cookie[env.COOKIE_USER_ID]
    return {};
  }
  return {
    token: cookie[env.COOKIE_TOKEN],
    userId: cookie[env.COOKIE_USER_ID]
  };
};

export const deleteCookie = () => {
  const options = {
    maxAge: -1, // Expire the cookie immediately.
    path: '/'
  };

  document.cookie = serialize(env.COOKIE_TOKEN, '', options);
  document.cookie = serialize(env.COOKIE_USER_ID, '', options);
};

export const setCookie = (token, userId) => {
  const options = {
    maxAge: 30 * 24 * 60 * 60, // One month
    path: '/'
  };

  document.cookie = serialize(env.COOKIE_TOKEN, token, options);
  document.cookie = serialize(env.COOKIE_USER_ID, userId, options);
};
