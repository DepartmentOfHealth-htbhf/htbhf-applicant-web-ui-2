const reporter = require('cucumber-html-reporter')

const options = {
  theme: 'bootstrap',
  jsonFile: 'build/reports/smoke-report.json',
  output: 'build/reports/smoke-report.html',
  reportSuiteAsScenarios: true,
  brandTitle: 'Smoke Tests',
  launchReport: false
}

reporter.generate(options)
