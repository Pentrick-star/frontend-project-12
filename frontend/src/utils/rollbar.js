import Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN || 'your-access-token-here',
  environment: import.meta.env.MODE || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    client: {
      javascript: {
        source_map_enabled: true,
        code_version: '1.0.0',
        // source_map_url: 'https://your-domain.com/static/js/bundle.js.map'
      }
    }
  }
});

export default rollbar;
