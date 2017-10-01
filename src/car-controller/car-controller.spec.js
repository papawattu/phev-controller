import chai from 'chai'
import sinon from 'sinon'

import CarController from './car-controller'

const assert = chai.assert

const messagingClient = {}
messagingClient.start = sinon.stub()
messagingClient.stop = sinon.stub()
messagingClient.start.returns(Promise.resolve())
messagingClient.stop.returns(Promise.resolve())


const incomingMessageHandler = {}
incomingMessageHandler.start = sinon.stub()
incomingMessageHandler.addHandler = sinon.stub()

const outgoingMessageHandler = {}
outgoingMessageHandler.start = sinon.stub()

const store = {}
store.set = sinon.stub()
store.get = sinon.stub()

let sut = null

describe('Car Controller', () => {
    beforeEach(() => {
        sut = CarController({ 
            messaging: messagingClient,
            store,
            incomingMessageHandler,
            outgoingMessageHandler, 
        })
    })
    after(() => {
        sut.stop()
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
    it('Should emit 0x6f messages', done => {
        incomingMessageHandler.addHandler.yields({ command: 0x6f, register: 0x01, data: Buffer.from([0,1,2,3])})
        
        sut.start()
        
        sut.on('message', message => {
            assert.deepEqual(message, { register: 0x01, data: Buffer.from([0,1,2,3])})
            done()
        })
    })
})