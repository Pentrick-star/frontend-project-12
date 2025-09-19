/* eslint @stylistic/indent: 0 */
export const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: import.meta.env.MODE,
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: import.meta.env.PROD, // в dev не отправляем
}
