# htbhf-applicant-web-ui

[![Build Status](https://travis-ci.com/DepartmentOfHealth-htbhf/htbhf-applicant-web-ui.svg?branch=master)](https://travis-ci.com/DepartmentOfHealth-htbhf/htbhf-applicant-web-ui)
[![Known Vulnerabilities](https://snyk.io/test/github/DepartmentOfHealth-htbhf/htbhf-applicant-web-ui/badge.svg?targetFile=package.json)](https://snyk.io/test/github/DepartmentOfHealth-htbhf/htbhf-applicant-web-ui?targetFile=package.json)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Coverage Status](https://codecov.io/gh/DepartmentOfHealth-htbhf/htbhf-applicant-web-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/DepartmentOfHealth-htbhf/htbhf-applicant-web-ui)

## Environment variables
Before starting the application or running tests, ensure that the correct environment variables have been set. A list of required environment variables are available in `sample.env`.

Locally the app uses [`dotenv`](https://www.npmjs.com/package/dotenv) to set environment variables. The easiest way to get started locally is to duplicate `sample.env` and rename to `.env`. `dotenv` will use the `.env` file to set environemt varaiables. It is important that `.env` is never commited to the code repository as it may contain sensitive data.

## User interface

### Design patterns
The application implements the GOV.UK design system. Visit the project website [https://design-system.service.gov.uk](https://design-system.service.gov.uk) for more information and documentation.

### Templating
To easily implement the GOV.UK design system, the application uses Nunjucks as a templating language. Visit the website [https://mozilla.github.io/nunjucks](https://mozilla.github.io/nunjucks) for more information and documentation.

### Creating a new step in the form
To add a new form step to the application, create an object matching the following schema 

```
{
  path: String,
  next: String,
  template: String,
  sanitize: Express middleware (function or array),
  validate: Express middleware (function or array),
  pageContent : Object
}
```
See [enter-name](src/web/routes/application/enter-name/enter-name.js) for an example. 

Then add the step to the [list of steps](src/web/routes/application/steps.js)

### Translations
The application uses the library [i18next](https://github.com/i18next/i18next) to allow the user to view pages in different languages. 
The requests [accept-language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language) header is used to determine which language to render the page in.
Currently English and Welsh are supported (currently using Lorem Ipsum for Welsh until translations are provided).

To add support for a new language, the translation document must be added to [src/web/server/locales/](src/web/server/locales). 
See [src/web/server/locales/en/common.json](src/web/server/locales/en/common.json) for an example.

If no accept-language header is provided the application will default to English.

## Tests

### Linting
The application uses Javascript Standard Style. Visit the project website [https://standardjs.com](https://standardjs.com) for more information and documentation. Plugins are available for various text editors.

### Unit
The application uses Tape for unit testing, visit [https://github.com/substack/tape](https://github.com/substack/tape) for documentation.

Unit tests can be started with the command `npm run test:unit`. The application will look for for tests in these locations:

- `./src/config/**/*.test.js`
- `./src/web/**/*.test.js`

Files containing unit tests in files must use the naming convention `*.test.js`.

### Acceptance
The acceptance tests are defined within Gherkin feature files and run via Cucumber-JS. They can be found
in the `src/test/acceptance/features` directory and can be run via `npm run test:acceptance`.
The `pages.js` is setup to define anything that can be reused between the various step files, specifically
the page objects and the Selenium web driver. The page object model that has been implemented in the
`common/page` directory is specifically set out to be shared between the acceptance and smoke tests.

### Smoke
The smoke tests can be found in the `src/test/smoke` directory and contain a very small set of tests
that are run to prove an environment is "up" and nothing more. They use the same page model as the acceptance
tests and can be run via `npm run test:smoke`. To run these tests against a local instance for debuggging
purposes, you simply need to set the environment variable `APP_HOST=http://localhost:8080` and it will run
against your local running instance.
