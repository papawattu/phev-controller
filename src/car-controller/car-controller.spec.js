import chai from 'chai'
import sinon from 'sinon'

import CarController from './car-controller'

const assert = chai.assert

const messagingClient = {}
messagingClient.start = sinon.stub()
messagingClient.start.returns(Promise.resolve())

const incomingMessageHandler = {}
incomingMessageHandler.start = sinon.stub()

const outgoingMessageHandler = {}
outgoingMessageHandler.start = sinon.stub()

let sut = null

describe('Car Controller', () => {
    beforeEach(() => {
        sut = CarController({ 
            messaging: messagingClient,
            incomingMessageHandler,
            outgoingMessageHandler, 
        })
    })
    it('Should start messaging', () => {
        sut.start()
        assert(messagingClient.start.called)
    })
    it('Should start outgoing message handler', () => {
        assert(outgoingMessageHandler.start.called)
    })
    it('Should start incoming message handler', () => {
        assert(incomingMessageHandler.start.called)
    })
})