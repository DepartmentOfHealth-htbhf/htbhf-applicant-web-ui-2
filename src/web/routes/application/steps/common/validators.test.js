const test = require('tape')
const { dateAsString } = require('./formatters')
const {
  isValidDate,
  isDateInPast,
  isDateOneOrMoreMonthsInThePast,
  isDateMoreThanEightMonthsInTheFuture,
  isDateFourOrMoreYearsInThePast,
  isDateInTheFuture
} = require('./validators')

test('isValidDate', (t) => {
  t.equal(isValidDate('1999-12-12'), true, '"1999-12-12" should be a valid date')
  t.equal(isValidDate('1900-01-01'), true, '"1900-01-01" should be a valid date')
  t.equal(isValidDate('2999-12-31'), true, '"2999-12-31" should be a valid date')

  t.equal(isValidDate(null), false, 'null should not be a valid date')
  t.equal(isValidDate('2009-02-29'), false, '"2009-02-29" should not be a valid date')
  t.equal(isValidDate('abcd-ab-ab'), false, '"abcd-ab-ab" should not be a valid date')
  t.equal(isValidDate('2007-04-05T14:30'), false, '"2007-04-05T14:30" should not be a valid date')
  t.end()
})

test('isDateInPast', (t) => {
  const today = new Date()
  const yyyy = today.getFullYear() + 1

  const nextYear = yyyy + '-01-01'

  t.equal(isDateInPast('1999-12-12'), true, '"1999-12-12" is a date in the past')
  t.equal(isDateInPast(nextYear), false, `"${nextYear}" is a date in the future`)
  t.equal(isDateInPast(null), true, 'null should not be validated')
  t.end()
})

test('isDateMoreThanOneMonthAgo', (t) => {
  const oneMonthAgo = dateAsString({ monthAdjustment: -1 })

  t.equal(isDateOneOrMoreMonthsInThePast('1999-12-12'), true, '"1999-12-12" is more than one month ago')
  t.equal(isDateOneOrMoreMonthsInThePast('9999-12-12'), false, '"9999-12-12" is not more than one month ago')
  t.equal(isDateOneOrMoreMonthsInThePast(oneMonthAgo), true, `"${oneMonthAgo}" is exactly one month ago`)
  t.equal(isDateOneOrMoreMonthsInThePast(''), true, 'blank string should not be validated')
  t.equal(isDateOneOrMoreMonthsInThePast(null), true, 'null string should not be validated')
  t.equal(isDateOneOrMoreMonthsInThePast('12-12-1999'), true, 'invalid format string "12-12-1999" should not be validated')
  t.end()
})

test('isDateMoreThanEightMonthsInTheFuture', (t) => {
  const eightMonthsInFuture = dateAsString({ monthAdjustment: -8 })

  t.equal(isDateMoreThanEightMonthsInTheFuture('1999-12-12'), false, '"1999-12-12" is not more than eight months in the future')
  t.equal(isDateMoreThanEightMonthsInTheFuture('9999-12-12'), true, '"9999-12-12" is more than eight months in the future')
  t.equal(isDateMoreThanEightMonthsInTheFuture(eightMonthsInFuture), false, `"${eightMonthsInFuture}" is exactly eight months in the future`)
  t.equal(isDateMoreThanEightMonthsInTheFuture(''), true, 'blank string should not be validated')
  t.equal(isDateMoreThanEightMonthsInTheFuture(null), true, 'null string should not be validated')
  t.equal(isDateMoreThanEightMonthsInTheFuture('12-12-1999'), true, 'invalid format string "12-12-1999" should not be validated')
  t.end()
})

test('isDateMoreThanFourYearsAgo', (t) => {
  const fourYearsAgo = dateAsString({ yearAdjustment: -4 })

  t.equal(isDateFourOrMoreYearsInThePast('9999-12-12'), false, '"9999-12-12" is not more than four years ago')
  t.equal(isDateFourOrMoreYearsInThePast('1900-12-12'), true, '"1900-12-12" is more than four years ago')
  t.equal(isDateFourOrMoreYearsInThePast(fourYearsAgo), true, `"${fourYearsAgo}" is exactly four years ago`)
  t.equal(isDateFourOrMoreYearsInThePast(''), true, 'blank string should not be validated')
  t.equal(isDateFourOrMoreYearsInThePast(null), true, 'null string should not be validated')
  t.equal(isDateFourOrMoreYearsInThePast('12-12-1999'), true, 'invalid format string "12-12-1999" should not be validated')
  t.end()
})

test('isDateInTheFuture', (t) => {
  const futureDate = dateAsString({ monthAdjustment: 1 })
  const pastDate = dateAsString({ monthAdjustment: -1 })

  t.equal(isDateInTheFuture('3000-12-12'), true, '"3000-12-12" is a date in the future')
  t.equal(isDateInTheFuture('2000-12-12'), false, '"2000-12-12" is a date in the past')
  t.equal(isDateInTheFuture(futureDate), true, `"${futureDate}" is a date in the future`)
  t.equal(isDateInTheFuture(pastDate), false, `"${pastDate}" is a date in the past`)
  t.equal(isDateInTheFuture(null), true, 'null should not be validated')
  t.end()
})
