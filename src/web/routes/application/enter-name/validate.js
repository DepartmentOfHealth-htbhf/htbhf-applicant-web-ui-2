const { check } = require('express-validator/check')

const FIRST_NAME_MAX_LENGTH = 500
const LAST_NAME_MAX_LENGTH = 500

const validate = [
  check('firstName').isLength({ max: FIRST_NAME_MAX_LENGTH }).withMessage((value, { req }) => req.t('validation:firstNameTooLong', { value })),
  check('lastName').not().isEmpty().withMessage((value, { req }) => req.t('validation:missingLastName', { value })),
  check('lastName').isLength({ max: LAST_NAME_MAX_LENGTH }).withMessage((value, { req }) => req.t('validation:lastNameTooLong', { value }))
]

module.exports = {
  validate
}
