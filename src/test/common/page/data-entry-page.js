const Page = require('./page')

class DataEntryPage extends Page {
  async getSubmitButton () {
    return this.findByClassName('govuk-button')
  }

  async submitForm () {
    const submitButton = await this.getSubmitButton()
    await submitButton.click()
  }
}

module.exports = DataEntryPage
