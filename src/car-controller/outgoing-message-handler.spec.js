import chai from 'chai'
import sinon from 'sinon'

import OutgoingMessageHandler from './outgoing-message-handler'

const assert = chai.assert

let sut = null

const messaging = {}
messaging.publish = sinon.stub()

const mac = [0x00,0x00,0x00,0x00,0x00,0x00]

describe('Outgoing Message Handler', () => {
    beforeEach(() => {
        sut = OutgoingMessageHandler({ messaging, mac })
    })
    after(() => {
        sut.stop()
    })
    it('Should have start command', () => {
        assert(sut.start)
    })
    it('Should send init command', () => {
        sut.start()
        assert(messaging.publish.calledWith(Buffer.from([0xf2,0x0a,0x00,0x01,0x02,0x00,0x00,0x00,0x00,0x00,0x00,0xff])))
        assert(messaging.publish.calledWith(Buffer.from([0xf6,0x04,0x00,0x0aa,0x00,0xa4])))
    })
})