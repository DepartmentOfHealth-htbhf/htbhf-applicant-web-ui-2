const { When, Then } = require('cucumber')
const { expect } = require('chai')

const pages = require('./pages')
const { assertErrorHeaderTextPresent, assertFieldErrorAndLinkTextPresentAndCorrect } = require('./common-assertions')
const { TEXT_LABEL, EMAIL_LABEL } = require('../steps/constants')

When(/^I select Text as the method to receive the code$/, async function () {
  await pages.chooseChannelForCode.selectTextRadioButton()
})

When(/^I select Email as the method to receive the code$/, async function () {
  await pages.chooseChannelForCode.selectEmailRadioButton()
})

Then(/^I am shown the choose channel for code page$/, async function () {
  await pages.chooseChannelForCode.waitForPageLoad()
})

Then(/^Text and Email options are displayed on the choose channel for code page$/, async function () {
  const labels = await pages.chooseChannelForCode.getAllRadioLabels()
  const text = await Promise.all(labels.map(async (label) => label.getText()))

  expect(text).to.include(TEXT_LABEL)
  expect(text).to.include(EMAIL_LABEL)
})

Then(/^I am informed that I need to select an option for choose channel for code$/, async function () {
  await assertErrorHeaderTextPresent(pages.chooseChannelForCode)
  await assertChooseChannelForCodePresent()
})

async function assertChooseChannelForCodePresent () {
  await assertFieldErrorAndLinkTextPresentAndCorrect(
    pages.chooseChannelForCode.getFieldErrorId(),
    pages.chooseChannelForCode.getErrorLinkCss(),
    'Select if you want to receive a code by text or email')
}
