const express = require('express')

const {
  configurePost,
  getSessionDetails,
  handlePost,
  renderView,
  sanitize,
  configureGet
} = require('./middleware')

const middlewareNoop = (req, res, next) => next()

const handleOptionalMiddleware = (operation, fallback = middlewareNoop) => {
  if (typeof operation === 'undefined') {
    return fallback
  }

  return operation
}

const createRoute = (csrfProtection, steps, router) => (step) =>
  router
    .route(step.path)
    .get(
      csrfProtection,
      configureGet(steps, step),
      getSessionDetails,
      renderView(step.template, step.pageContent, step.next, step.previous)
    )
    .post(
      csrfProtection,
      configurePost,
      sanitize,
      handleOptionalMiddleware(step.sanitize),
      handleOptionalMiddleware(step.validate),
      getSessionDetails,
      handlePost,
      renderView(step.template, step.pageContent, step.next, step.previous)
    )

const registerFormRoutes = (csrfProtection, steps, app) => {
  const wizard = express.Router()
  steps.forEach(createRoute(csrfProtection, steps, wizard))
  app.use(wizard)
}

module.exports = {
  registerFormRoutes,
  handleOptionalMiddleware
}
