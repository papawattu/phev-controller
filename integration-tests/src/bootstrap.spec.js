import chai from 'chai'
import sinon from 'sinon'

import MessagingClient from './local-pubsub'
import LocalStore from './local-store'
import App from '../../src/app'

const assert = chai.assert

describe('Integration Tests', ()=> {
    it('Should bootstrap App', () => {
        const sut = App({ messaging: MessagingClient(), store: LocalStore()})
        assert.isNotNull(sut)
    })
    it('Should send start message', done => {
        const messaging = MessagingClient().registerHandler(message => {
            assert.deepEqual(message, Buffer.from([0xf2]))
            done()
        })
        App({ messaging: MessagingClient(), store: LocalStore()})
    })
})
