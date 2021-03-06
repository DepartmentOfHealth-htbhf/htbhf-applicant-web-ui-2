const { compose, equals, prop } = require('ramda')
const { CHECK_ANSWERS_URL, prefixPath } = require('../../../paths')

const isMatchingPath = path => compose(equals(path), prop('path'))

const isLastStep = (steps, index) => index === steps.length - 1

const getPathFromNextStep = (steps, index) => prop('path', steps[index + 1])

const getNextPathFromSteps = (journey, step) => {
  const { steps, pathPrefix } = journey
  const currentPath = step.path
  const index = steps.findIndex(isMatchingPath(currentPath))
  return isLastStep(steps, index) ? prefixPath(pathPrefix, CHECK_ANSWERS_URL) : getPathFromNextStep(steps, index)
}

const getNextForStep = (req, journey, step) => {
  const { next } = step

  if (typeof next === 'undefined') {
    return getNextPathFromSteps(journey, step)
  }

  if (typeof next !== 'function') {
    throw new Error('Next property for step must be a function')
  }

  const nextPath = next(req)

  if (typeof nextPath !== 'string' || !nextPath.startsWith('/')) {
    throw new Error('Next function must return a string starting with a forward slash')
  }

  return nextPath
}

module.exports = {
  getNextPathFromSteps,
  getNextForStep
}
