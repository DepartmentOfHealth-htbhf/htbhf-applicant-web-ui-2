const { Then } = require('cucumber')
const { assertBackLinkUrlIsEqualTo } = require('./common-asserts')

const pages = require('./pages')

Then(/^I am shown the add your childrens dates of birth page$/, async function () {
  await pages.addChildrenDOB.waitForPageLoad()
})

Then(/^The back link points to the Add your children’s dates of birth page$/, async function () {
  await assertBackLinkUrlIsEqualTo(`${pages.url}${pages.addChildrenDOB.getPath()}`)
})
