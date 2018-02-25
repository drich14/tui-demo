import cookie from 'cookie';

export default (context = {}, options = {}) => {
  return cookie.parse(
    context.req && context.req.headers.cookie
      ? context.req.headers.cookie
      : document.cookie,
    options
  );
};
