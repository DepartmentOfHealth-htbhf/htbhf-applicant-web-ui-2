const test = require('tape')
const sinon = require('sinon')
const states = require('../states')
const { configureSessionDetails } = require('./session-details')

const apply = {
  name: 'apply',
  pathsInSequence: ['/first', '/second']
}

const reportChange = {
  name: 'report-a-change',
  pathsInSequence: ['/one', '/two']
}

test('configureSessionDetails() sets claim on res.locals', (t) => {
  const journey = apply

  const req = {
    session: {
      claim: {
        name: 'Lisa'
      }
    }
  }

  const res = { locals: {} }
  const next = sinon.stub()

  const expectedLocals = {
    claim: {
      name: 'Lisa'
    }
  }

  configureSessionDetails(journey)(req, res, next)
  t.deepEqual(res.locals, expectedLocals, 'sets claim on res.locals')
  t.equal(next.called, true, 'calls next()')
  t.end()
})

test('configureSessionDetails() initialises journey in session when session.journeys is undefined', (t) => {
  const journey = apply
  const req = { session: {} }
  const res = { locals: {} }
  const next = sinon.stub()

  const expectedSession = {
    journeys: {
      apply: {
        nextAllowedStep: '/first',
        state: states.IN_PROGRESS
      }
    },
    stepData: {}
  }

  configureSessionDetails(journey)(req, res, next)
  t.deepEqual(req.session, expectedSession, 'initialises journey in session')
  t.equal(next.called, true, 'calls next()')
  t.end()
})

test('configureSessionDetails() initialises journey in session when session.journeys is defined', (t) => {
  const journey = reportChange

  const req = {
    session: {
      journeys: {
        apply
      },
      stepData: { foo: 'bar' }
    }
  }

  const res = { locals: {} }
  const next = sinon.stub()

  const expectedSession = {
    journeys: {
      apply,
      'report-a-change': {
        nextAllowedStep: '/one',
        state: states.IN_PROGRESS
      }
    },
    stepData: { foo: 'bar' }
  }

  configureSessionDetails(journey)(req, res, next)
  t.deepEqual(req.session, expectedSession, 'initialises journey in session')
  t.equal(next.called, true, 'calls next()')
  t.end()
})

test('configureSessionDetails() does not reinitialise a journey that already exists in session', (t) => {
  const journey = apply

  const req = {
    session: {
      journeys: {
        apply: {
          nextAllowedStep: '/second',
          state: 'IN_REVIEW'
        }
      },
      stepData: { foo: 'bar' }
    }
  }
  const res = { locals: {} }
  const next = sinon.stub()

  const expectedSession = {
    journeys: {
      apply: {
        nextAllowedStep: '/second',
        state: 'IN_REVIEW'
      }
    },
    stepData: { foo: 'bar' }
  }

  configureSessionDetails(journey)(req, res, next)
  t.deepEqual(req.session, expectedSession, 'does not reinitialise a journey')
  t.equal(next.called, true, 'calls next()')
  t.end()
})
