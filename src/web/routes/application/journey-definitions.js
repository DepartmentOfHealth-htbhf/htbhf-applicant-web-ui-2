const { nationalInsuranceNumber } = require('./national-insurance-number')
const { name } = require('./name')
const { dateOfBirth } = require('./date-of-birth')
const { areYouPregnant } = require('./are-you-pregnant')
const { manualAddress } = require('./address/manual-address')
const { phoneNumber } = require('./phone-number')
const { scotland } = require('./scotland')
const { inScotland } = require('./in-scotland')
const { emailAddress } = require('./email-address')
const { doYouHaveChildren } = require('./do-you-have-children')
const { childDateOfBirth } = require('./child-date-of-birth')
const { sendCode } = require('./send-code')
const { enterCode } = require('./enter-code')
const { postcode } = require('./address/postcode')
const { selectAddress } = require('./address/select-address')

const APPLY = {
  steps: [
    scotland,
    inScotland,
    dateOfBirth,
    doYouHaveChildren,
    childDateOfBirth,
    areYouPregnant,
    name,
    nationalInsuranceNumber,
    postcode,
    selectAddress,
    manualAddress,
    phoneNumber,
    emailAddress,
    sendCode,
    enterCode
  ]
}

// TODO do not add new user journeys until all stories in "Support Multiple User
// Journeys in Web UI" epic (HTBHF-2515) are complete
module.exports.JOURNEYS = [APPLY]
