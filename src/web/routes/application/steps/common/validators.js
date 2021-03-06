const { isNil } = require('ramda')
const validator = require('validator')
const { check } = require('express-validator')
const { dateAsString } = require('./formatters')
const { translateValidationMessage } = require('./translate-validation-message')
const { YES, NO } = require('./constants')

const DATE_PATTERN = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/

const isValidDate = (dateString) =>
  !isNil(dateString) && validator.matches(dateString, DATE_PATTERN) && validator.isISO8601(dateString, { strict: true })

const isDateInPast = (dateString) => {
  if (isValidDate(dateString)) {
    return validator.isBefore(dateString, dateAsString())
  }
  return true
}

const isDateOneOrMoreMonthsInThePast = (dateString) => {
  if (isValidDate(dateString)) {
    return !validator.isAfter(dateString, dateAsString({ monthAdjustment: -1 }))
  }
  return true
}

const isDateMoreThanEightMonthsInTheFuture = (dateString) => {
  if (isValidDate(dateString)) {
    return validator.isAfter(dateString, dateAsString({ monthAdjustment: 8 }))
  }
  return true
}

const isDateInTheFuture = (dateString) => {
  if (isValidDate(dateString)) {
    return validator.isAfter(dateString, dateAsString())
  }
  return true
}

const validateIsYesOrNo = (fieldName, validationMessage) =>
  check(fieldName).isIn([YES, NO]).withMessage(translateValidationMessage(validationMessage))

const isDateFourOrMoreYearsInThePast = (dateString) => {
  if (isValidDate(dateString)) {
    return !validator.isAfter(dateString, dateAsString({ yearAdjustment: -4 }))
  }
  return true
}

module.exports = {
  isValidDate,
  isDateInPast,
  isDateOneOrMoreMonthsInThePast,
  isDateMoreThanEightMonthsInTheFuture,
  validateIsYesOrNo,
  isDateFourOrMoreYearsInThePast,
  isDateInTheFuture
}
