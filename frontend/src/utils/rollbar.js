// Конфигурация Rollbar
export const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN || 'your-rollbar-access-token',
  environment: import.meta.env.MODE || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    client: {
      javascript: {
        source_map_enabled: true,
        code_version: '1.0.0',
        // Опционально: добавьте source maps для продакшена
        // source_map_url: 'https://your-domain.com/static/js/main.js.map'
      }
    }
  }
};
