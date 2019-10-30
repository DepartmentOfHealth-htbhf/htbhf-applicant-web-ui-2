const httpStatus = require('http-status-codes')
const { validationResult } = require('express-validator')
const { wrapError } = require('../common/formatters')
const { stateMachine, actions } = require('../flow-control')

const { INVALIDATE_REVIEW, INCREMENT_NEXT_ALLOWED_PATH } = actions

const stepInvalidatesReview = (step, claim) => typeof step.shouldInvalidateReview === 'function' && step.shouldInvalidateReview(claim)

const handlePost = (journey, step) => (req, res, next) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.locals.errors = errors.array()
      res.locals.claim = req.body
      return next()
    }

    req.session.claim = {
      ...req.session.claim,
      ...req.body
    }

    if (stepInvalidatesReview(step, req.session.claim)) {
      stateMachine.dispatch(INVALIDATE_REVIEW, req)
    }

    stateMachine.dispatch(INCREMENT_NEXT_ALLOWED_PATH, req, journey.steps)

    return next()
  } catch (error) {
    next(wrapError({
      cause: error,
      message: `Error posting ${req.path}`,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR
    }))
  }
}

module.exports = {
  handlePost
}
