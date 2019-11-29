const httpStatus = require('http-status-codes')
const { path, isNil } = require('ramda')
const { configureSessionDetails, handleRequestForPath } = require('../../flow-control')
const { DECISION_URL, prefixPath } = require('../../paths')
const { ELIGIBLE } = require('../common/constants')
const { wrapError } = require('../../errors')

const toPounds = pence => (parseInt(pence, 10) / 100).toFixed(2)

const isNilOrLteZero = value => isNil(value) || value <= 0

const getTitle = req => {
  if (path(['session', 'claimUpdated'], req) === true) {
    return req.t('decision.updatedClaimTitle')
  }

  return req.t('decision.newClaimTitle')
}

const getDecisionPage = (req, res, next) => {
  if (req.session.eligibilityStatus === ELIGIBLE) {
    const totalVoucherValueInPence = path(['session', 'voucherEntitlement', 'totalVoucherValueInPence'], req)

    if (isNilOrLteZero(totalVoucherValueInPence)) {
      const errorMessage = `Invalid voucher value in pence returned from claimant service for ${ELIGIBLE} status: ${totalVoucherValueInPence}`
      return next(wrapError({
        cause: new Error(errorMessage),
        message: errorMessage,
        statusCode: httpStatus.INTERNAL_SERVER_ERROR
      }))
    }

    return res.render('decision', {
      title: getTitle(req),
      subTitle: req.t('decision.subTitle',
        {
          totalVoucherValue: toPounds(totalVoucherValueInPence),
          totalVoucherValueForFourWeeks: toPounds(totalVoucherValueInPence * 4)
        })
    })
  }

  const eligibilityStatus = req.session.eligibilityStatus.toLowerCase()
  return res.render('unsuccessful-application', {
    title: req.t('unsuccessfulApplication.title'),
    subTitle: req.t('unsuccessfulApplication.subTitle'),
    heading: req.t('unsuccessfulApplication.title'),
    eligibilityStatus
  })
}

const registerDecisionRoute = (journey, app) =>
  app.get(prefixPath(journey.pathPrefix, DECISION_URL), configureSessionDetails(journey), handleRequestForPath(journey), getDecisionPage)

module.exports = {
  toPounds,
  isNilOrLteZero,
  registerDecisionRoute,
  getDecisionPage,
  getTitle
}