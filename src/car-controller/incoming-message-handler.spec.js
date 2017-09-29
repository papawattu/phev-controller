import chai from 'chai'
import sinon from 'sinon'

import IncomingMessageHandler from './incoming-message-handler'

const assert = chai.assert

let sut = null

const messaging = {}
messaging.registerHandler = sinon.stub()
messaging.publish = sinon.stub()

describe('Incoming Message Handler', () => {
    beforeEach(() => {
        sut = IncomingMessageHandler({ messaging })
        messaging.registerHandler.reset()
        messaging.publish.reset()
        
    })
    it('Should have start command', () => {
        assert(sut.start)
    })
    it('Should call register handler', () => {
        sut.start()
        assert(messaging.registerHandler.called)
    })
})