const { getPreviousPage } = require('./get-previous-page')

const configurePost = (steps, step) => (req, res, next) => {
  res.locals.errorTitleText = req.t('validation:errorTitleText')
  res.locals.previous = getPreviousPage(steps, step, req.session)

  next()
}

module.exports = {
  configurePost
}
