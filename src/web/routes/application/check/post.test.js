const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const post = sinon.stub()
const { postCheck } = proxyquire('./post', {
  'request-promise': { post }
})

const config = {
  environment: {
    CLAIMANT_SERVICE_URL: 'https://claim.com'
  }
}

test('successful post clears the session and redirects', async (t) => {
  const destroy = sinon.spy()
  const redirect = sinon.spy()
  const req = {
    session: {
      destroy
    }
  }
  const res = { redirect }
  const next = {}

  post.returns(Promise.resolve())

  try {
    await postCheck(config)(req, res, next)
    t.equal(destroy.called, true)
    t.end()
  } catch (error) {
    t.fail(error)
  }
})

test('unsuccessful post calls next with error', async (t) => {
  const req = {}
  const res = {}
  const next = sinon.spy()

  post.returns(new Error('error'))

  try {
    await postCheck(config)(req, res, next)
    t.equal(next.calledWith(sinon.match.instanceOf(Error)), true)
    t.end()
  } catch (error) {
    t.fail(error)
  }
})
