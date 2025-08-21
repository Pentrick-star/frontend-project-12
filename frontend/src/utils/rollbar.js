import Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN || 'your-rollbar-access-token', // eslint-disable-line no-undef
  environment: process.env.NODE_ENV || 'development', // eslint-disable-line no-undef
  captureUncaught: true,
  captureUnhandledRejections: true,
});

export default rollbar;
