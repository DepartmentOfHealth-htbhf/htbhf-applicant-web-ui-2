'use strict'

const SubmittablePage = require('./submittable-page')
const CHECK_PAGE_TITLE = 'GOV.UK - Check your answers'
const GOV_LIST_ROW_SELECTOR = '#claim-summary .govuk-summary-list__row'
const GOV_LIST_HEADER_CLASSNAME = 'govuk-summary-list__key'
const GOV_LIST_VALUE_CLASSNAME = 'govuk-summary-list__value'
const GOV_LIST_ACTION_CLASSNAME = 'govuk-summary-list__actions'
const GOV_LINK_CLASSNAME = 'govuk-link'
const GOV_HIDDEN_CLASSNAME = 'govuk-visually-hidden'

/**
 * Page object for the page where the customer can check their details before submitting.
 */
class Check extends SubmittablePage {
  getPath () {
    return '/check'
  }

  getPageName () {
    return 'check details'
  }

  async waitForPageLoad () {
    return super.waitForPageWithTitle(CHECK_PAGE_TITLE)
  }

  async getCheckDetailsTableContents () {
    const tableRows = await this.findAllByCSS(GOV_LIST_ROW_SELECTOR)
    const getDataForRows = tableRows.map(async (tableRow) => this.getDataForRow(tableRow))
    return Promise.all(getDataForRows)
  }

  async getDataForRow (tableRow) {
    try {
      const header = await this.findByClassName(GOV_LIST_HEADER_CLASSNAME, tableRow)
      const headerText = await header.getText()
      const value = await this.findByClassName(GOV_LIST_VALUE_CLASSNAME, tableRow)
      const valueText = await value.getText()
      const change = await this.findByClassName(GOV_LIST_ACTION_CLASSNAME, tableRow)
      const changeLink = await this.findByClassName(GOV_LINK_CLASSNAME, change)
      const changeUrl = await changeLink.getAttribute('href')
      const changeText = await changeLink.getText()
      const hiddenSpan = await this.findByClassName(GOV_HIDDEN_CLASSNAME, changeLink)
      const hiddenText = await hiddenSpan.getText()

      return {
        header: headerText,
        value: valueText,
        action: { url: changeUrl, text: changeText.replace(hiddenText, '').trim(), hiddenText: hiddenText }
      }
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  async clickChangeLinkFor (headerText) {
    const link = await this.findByXPath(`//a[contains(@class, 'govuk-link') and contains(.//span, '${headerText}')]`)
    await link.click()
  }
}

module.exports = Check
