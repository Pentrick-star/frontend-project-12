import Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: 'YOUR_ROLLBAR_ACCESS_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: 'production',
  },
});

export default rollbar;