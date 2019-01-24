const { Given, When, Then } = require('cucumber')
const { expect, assert } = require('chai')

const pages = require('./pages')
const { enterNameAndSubmit, assertErrorHeaderTextPresent } = require('./common-steps')

const LONG_NAME = 'This name is way too long' +
  'This name is way too long' +
  'This name is way too long' +
  'This name is way too long' + // 100
  'This name is way too long' +
  'This name is way too long' +
  'This name is way too long' +
  'This name is way too long' + // 200
  'This name is way too long' +
  'This name is way too long' +
  'This name is way too long' +
  'This name is way too long' + // 300
  'This name is way too long' +
  'This name is way too long' +
  'This name is way too long' +
  'This name is way too long' + // 400
  'This name is way too long' +
  'This name is way too long' +
  'This name is way too long' +
  'This name is way too long' + // 500
  'This name is way too long'

const BLANK_NAME = ''

Given('I am on the enter name page', async function () {
  await pages.enterName.open(pages.url)
})

When('I enter a first name which is too long', async function () {
  return enterNameAndSubmit(LONG_NAME, 'Bloggs')
})

When('I enter a last name which is too long', async function () {
  return enterNameAndSubmit('Joe', LONG_NAME)
})

When('I enter first name only', async function () {
  return enterNameAndSubmit('Joe', BLANK_NAME)
})

When(/^I enter (.*) and (.*) values$/, async function (firstName, lastName) {
  return enterNameAndSubmit(firstName, lastName)
})

Then('I am informed that the first name is too long', async function () {
  await assertErrorHeaderTextPresent(pages.enterName)
  const errorMessage = await pages.enterName.getFirstNameError()
  expect(errorMessage).to.be.equal('Enter a shorter first or given name')
})

Then(/^I see the invalid first name I entered in the textbox$/, async function () {
  const enteredFirstName = await pages.enterName.getFirstNameValue()
  expect(enteredFirstName).to.be.equal(LONG_NAME)
})

Then(/^I see the last name I entered in the textbox$/, async function () {
  const enteredFirstName = await pages.enterName.getLastNameValue()
  expect(enteredFirstName).to.be.equal(LONG_NAME)
})

Then('I am informed that the last name is too long', async function () {
  await assertErrorHeaderTextPresent(pages.enterName)
  await assertLastNameErrorPresent('Enter a shorter last or family name')
})

Then('I am informed that a last name is required', async function () {
  await assertErrorHeaderTextPresent(pages.enterName)
  await assertLastNameErrorPresent('Enter your last or family name')
})

Then('I am shown the enter national insurance page', async function () {
  await pages.enterNino.waitForPageLoad()
})

async function assertLastNameErrorPresent (expectedErrorMessage) {
  try {
    const errorMessage = await pages.enterName.getLastNameError()
    expect(errorMessage).to.be.equal(expectedErrorMessage)
  } catch (error) {
    assert.fail(`Unexpected error caught trying to assert last name error message is present - ${error}`)
  }
}
