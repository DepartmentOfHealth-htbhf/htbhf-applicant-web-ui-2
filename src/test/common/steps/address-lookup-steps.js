/* eslint-disable no-unused-expressions */
const { When, Then } = require('cucumber')
const { expect } = require('chai')

const pages = require('./pages')
const { enterPostcodeAndSubmit } = require('./common-steps')
const { setupPostcodeLookupWithNoResults, setupPostcodeLookupWithResults } = require('../wiremock')
const { POSTCODE } = require('./constants')

const POSTCODE_WITH_NO_RESULTS = 'BS1 1AA'

When(/^I enter a postcode with no search results$/, async function () {
  await setupPostcodeLookupWithNoResults(POSTCODE_WITH_NO_RESULTS)
  await enterPostcodeAndSubmit(POSTCODE_WITH_NO_RESULTS)
})

When(/^I enter a postcode$/, async function () {
  await setupPostcodeLookupWithResults(POSTCODE)
  await enterPostcodeAndSubmit(POSTCODE)
})

Then(/^I am shown the select address page$/, async function () {
  await pages.selectAddress.waitForPageLoad()
})

Then(/^I am informed that no addresses were found for my postcode$/, async function () {
  const addressNotFoundElement = await pages.selectAddress.getAddressNotFoundElement()
  expect(await addressNotFoundElement.isDisplayed()).to.be.true
})

Then(/^I am shown a button to enter my address manually$/, async function () {
  const buttonText = await pages.selectAddress.getSubmitButtonText()
  expect(buttonText).to.be.equal('Enter address manually')
})

Then(/^I am shown a list of addresses$/, async function () {
  const addressOptions = await pages.selectAddress.getAddressOptions()
  expect(addressOptions.length).to.be.equal(11)
})

Then(/^I am shown a continue button$/, async function () {
  const buttonText = await pages.selectAddress.getSubmitButtonText()
  expect(buttonText).to.be.equal('Continue')
})
