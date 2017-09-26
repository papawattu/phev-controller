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
    it('Should acknowledge incoming message', () => {
        sut.start()
        
        messaging.registerHandler.yield(Buffer.from([0x6f,0x04,0x00,0x11,0x00,0x84]))

        assert(messaging.publish.calledWith(Buffer.from([0xf6,0x04,0x01,0x11,0x00,0x0c])))
    })
})