import chai from 'chai'
import sinon from 'sinon'

import MessagingClient from './local-pubsub'
import LocalStore from './local-store'
import App from '../../src/app'

const assert = chai.assert

const server = {}
server.start = sinon.stub()
server.stop = sinon.stub()
server.post = sinon.stub()

describe('Integration Tests', () => {
    it('Should bootstrap App', () => {
        const sut = App({ messaging: MessagingClient(), store: LocalStore(), httpApiServer: server })
        assert.isNotNull(sut)
    })
    it('Should send start message', done => {
        const messaging = MessagingClient()

        messaging.eventEmitter.once('outgoing', message => {
            assert.deepEqual(message, Buffer.from([0xf2, 0x0a, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff]))
            done()
        })
        App({ messaging, store: LocalStore(), httpApiServer: server })
    })
    it('Should send AA message', done => {
        const messaging = MessagingClient()

        messaging.eventEmitter.on('outgoing', message => {
            if(message.equals(Buffer.from([0xf6, 0x04, 0x00, 0xaa, 0x00, 0xa4]))) done()
        })
        App({ messaging, store: LocalStore(), httpApiServer: server })
    })
})
