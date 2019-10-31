const { stateMachine, states } = require('../common/state-machine')
const { CHECK_ANSWERS_URL } = require('../common/constants')

const pageContent = ({ translate }) => ({
  title: translate('terms-and-conditions.title'),
  heading: translate('terms-and-conditions.heading'),
  buttonText: translate('buttons:acceptAndSend'),
  termsAndConditions: translate('terms-and-conditions.statement')
})

function render (res, req) {
  res.render('terms-and-conditions', {
    ...pageContent({ translate: req.t }),
    csrfToken: req.csrfToken(),
    previous: CHECK_ANSWERS_URL
  })
}

const getTermsAndConditions = (journey) => (req, res) => {
  stateMachine.setState(states.IN_REVIEW, req)

  render(res, req)
}

module.exports = {
  render,
  getTermsAndConditions
}
