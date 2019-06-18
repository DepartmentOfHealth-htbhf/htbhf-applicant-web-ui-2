/* no-process-exit */
'use strict'
require('dotenv')
const { getSIDCookieAndCSRFToken, postFormData } = require('../common/request')
const { setupSuccessfulWiremockClaimMapping, deleteAllWiremockMappings } = require('../common/wiremock')
const pa11yWithSettings = require('./pally')
const handleTestResults = require('./results')
const IGNORE_RULES = require('./ignore-rules')
const { PORT } = require('../common/config')
const { VALID_ELIGIBLE_NINO, PHONE_NUMBER, EMAIL_ADDRESS } = require('../common/steps/constants')

const BASE_URL = `http://localhost:${PORT}`
const ENTER_NAME_URL = `${BASE_URL}/enter-name`
const ENTER_NINO_URL = `${BASE_URL}/enter-nino`
const ENTER_DOB_URL = `${BASE_URL}/enter-dob`
const ARE_YOU_PREGNANT_URL = `${BASE_URL}/are-you-pregnant`
const CARD_ADDRESS_URL = `${BASE_URL}/card-address`
const PHONE_NUMBER_URL = `${BASE_URL}/phone-number`
const EMAIL_ADDRESS_URL = `${BASE_URL}/email-address`
const CHECK_URL = `${BASE_URL}/check`
const CONFIRM_URL = `${BASE_URL}/confirm`

const dateIn3Months = () => {
  const dueDate = new Date()
  dueDate.setDate(1)
  dueDate.setMonth(dueDate.getMonth() + 3)
  return dueDate
}

/*
  Runs though the application, evaluating each page and performing post requests to populate the necessary
  data in the database.
 */
const runTests = async () => {
  try {
    await setupSuccessfulWiremockClaimMapping()
    let results = []
    const { requestCookie, csrfToken } = await getSIDCookieAndCSRFToken(ENTER_DOB_URL)
    const pa11y = pa11yWithSettings(IGNORE_RULES, { Cookie: requestCookie })
    const formData = { '_csrf': csrfToken }

    results.push(await pa11y(ENTER_DOB_URL))
    await postFormData(ENTER_DOB_URL, {
      ...formData,
      'dob-day': '1',
      'dob-month': '10',
      'dob-year': '1980'
    }, requestCookie)

    results.push(await pa11y(ARE_YOU_PREGNANT_URL))
    const dueDate = dateIn3Months()
    await postFormData(ARE_YOU_PREGNANT_URL, {
      ...formData,
      'areYouPregnant-1': 'yes',
      'expectedDeliveryDate-day': dueDate.getDate(),
      'expectedDeliveryDate-month': dueDate.getMonth() + 1,
      'expectedDeliveryDate-year': dueDate.getYear()
    }, requestCookie)

    results.push(await pa11y(ENTER_NAME_URL))
    await postFormData(ENTER_NAME_URL, { ...formData, lastName: 'Lisa' }, requestCookie)

    results.push(await pa11y(ENTER_NINO_URL))
    await postFormData(ENTER_NINO_URL, { ...formData, nino: VALID_ELIGIBLE_NINO }, requestCookie)

    results.push(await pa11y(CARD_ADDRESS_URL))
    await postFormData(CARD_ADDRESS_URL, {
      ...formData,
      'addressLine1': 'Flat B',
      'addressLine2': 'Baker Street',
      'townOrCity': 'London',
      'postcode': 'AA1 1AA'
    }, requestCookie)

    results.push(await pa11y(PHONE_NUMBER_URL))
    await postFormData(PHONE_NUMBER_URL, { ...formData, phoneNumber: PHONE_NUMBER }, requestCookie)

    results.push(await pa11y(EMAIL_ADDRESS_URL))
    await postFormData(EMAIL_ADDRESS_URL, { ...formData, emailAddress: EMAIL_ADDRESS }, requestCookie)

    results.push(await pa11y(CHECK_URL))
    await postFormData(CHECK_URL, formData, requestCookie)

    results.push(await pa11y(CONFIRM_URL))

    handleTestResults(results)
  } catch (error) {
    console.log(error)
    process.exit(1)
  } finally {
    await deleteAllWiremockMappings()
  }
}

runTests()