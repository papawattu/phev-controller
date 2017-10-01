import chai from 'chai'
import sinon from 'sinon'

import App from './app'

const assert = chai.assert

const pubSub = {}

const carController = {}
carController.start = sinon.stub()
carController.on = sinon.stub()

describe('App', () => {
    beforeEach(() => {
        App({ carController })
    })
    it('Should send start command', () => {
        assert(carController.start.called)
    })
})