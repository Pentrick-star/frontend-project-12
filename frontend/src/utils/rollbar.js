// Временно отключаем Rollbar для учебного проекта
const rollbar = {
  error: () => {},
  info: () => {},
  warning: () => {},
  debug: () => {},
}

export default rollbar
