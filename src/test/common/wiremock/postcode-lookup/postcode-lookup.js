const { postJsonData } = require('../../request')
const { WIREMOCK_OS_PLACES_MAPPING_URL, WIREMOCK_GOOGLE_ANALYTICS_MAPPING_URL } = require('../paths')

const {
  createPostcodeLookupWithNoResultsMapping,
  createPostcodeLookupWithResultsMapping,
  createPostcodeLookupWithErrorResponseMapping,
  createPostcodeLookupWithConnectionResetMapping,
  createGoogleAnalyticsMapping
} = require('./mappings')

async function setupPostcodeLookupWithNoResults (postcode) {
  await postJsonData(WIREMOCK_GOOGLE_ANALYTICS_MAPPING_URL, createGoogleAnalyticsMapping())
  await postJsonData(WIREMOCK_OS_PLACES_MAPPING_URL, createPostcodeLookupWithNoResultsMapping(postcode))
}

async function setupPostcodeLookupWithResults (postcode) {
  await postJsonData(WIREMOCK_GOOGLE_ANALYTICS_MAPPING_URL, createGoogleAnalyticsMapping())
  await postJsonData(WIREMOCK_OS_PLACES_MAPPING_URL, createPostcodeLookupWithResultsMapping(postcode))
}

async function setupPostcodeLookupWithErrorResponse () {
  await postJsonData(WIREMOCK_GOOGLE_ANALYTICS_MAPPING_URL, createGoogleAnalyticsMapping())
  await postJsonData(WIREMOCK_OS_PLACES_MAPPING_URL, createPostcodeLookupWithErrorResponseMapping())
}

async function setupPostcodeLookupWithConnectionReset () {
  await postJsonData(WIREMOCK_GOOGLE_ANALYTICS_MAPPING_URL, createGoogleAnalyticsMapping())
  await postJsonData(WIREMOCK_OS_PLACES_MAPPING_URL, createPostcodeLookupWithConnectionResetMapping())
}

module.exports = {
  setupPostcodeLookupWithNoResults,
  setupPostcodeLookupWithResults,
  setupPostcodeLookupWithErrorResponse,
  setupPostcodeLookupWithConnectionReset
}
