const httpStatus = require('http-status-codes')
const request = require('request-promise')
const { path } = require('ramda')

const { wrapError } = require('../common/formatters')
const { logger } = require('../../../logger')
const { REQUEST_ID_HEADER } = require('../../../server/headers')
const { stateMachine, states, actions } = require('../common/state-machine')
const { createRequestBody } = require('./create-request-body')
const { isErrorStatusCode } = require('./predicates')
const { CLAIMS_ENDPOINT, NO_ELIGIBILITY_STATUS_MESSAGE } = require('./constants')

const transformResponse = (body, response) => {
  if (isErrorStatusCode(response.statusCode)) {
    throw new Error('Error posting to claimant service')
  }

  return response
}

const postCheck = (steps, config) => (req, res, next) => {
  logger.info('Sending claim', { req })

  return request.post({
    uri: `${config.environment.CLAIMANT_SERVICE_URL}${CLAIMS_ENDPOINT}`,
    json: true,
    headers: {
      'X-Request-ID': req.headers[REQUEST_ID_HEADER],
      'X-Session-ID': req.sessionID
    },
    body: createRequestBody(config, req),
    simple: false,
    transform: transformResponse
  })
    .then(
      (response) => {
        const responseBody = path(['body'], response)
        const { eligibilityStatus, voucherEntitlement, claimUpdated } = responseBody

        if (!eligibilityStatus) {
          return next(wrapError({
            cause: new Error(NO_ELIGIBILITY_STATUS_MESSAGE),
            message: NO_ELIGIBILITY_STATUS_MESSAGE,
            statusCode: response.statusCode
          }))
        }

        req.session.eligibilityStatus = eligibilityStatus
        req.session.voucherEntitlement = voucherEntitlement
        req.session.claimUpdated = claimUpdated

        stateMachine.setState(states.COMPLETED, req)
        req.session.nextAllowedStep = stateMachine.dispatch(actions.GET_NEXT_PATH, req, steps, req.path)
        return res.redirect('confirm')
      },
      (error) => {
        next(wrapError({
          cause: error,
          message: 'Error posting to claimant service',
          statusCode: path(['response', 'statusCode'], error) || httpStatus.INTERNAL_SERVER_ERROR
        }))
      }
    )
}

module.exports = {
  transformResponse,
  postCheck
}
