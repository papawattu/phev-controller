import IncomingMessageHandler from './incoming-message-handler'
import OutgoingMessageHandler from './outgoing-message-handler'
import Responder from './responder'
import EventEmitter from 'events'
import { RESP_CMD, REQUEST_TYPE } from './message-constants'
import { log } from 'phev-utils'

const CarController = ({
    messaging,
    store,
    incomingMessageHandler = IncomingMessageHandler({ messaging }),
    outgoingMessageHandler = OutgoingMessageHandler({ messaging }),
} = {}) => {

    const ev = new EventEmitter()
    
    const { set, get } = store

    const { acknowledgeHandler } = Responder(message => {
        outgoingMessageHandler.send(message)
    })

    const registerChanged = register => new Promise((resolve, reject) => store.get(register.register)
            .then(reg => {
                if(reg === undefined) {
                    return resolve(true)
                } 
        
                if(reg.data.equals(register.data)) {
                    return resolve(false)
                } else {
                    return resolve(true)
                } 
            }))
    
    const hasRegisterChanged = message => {
        if((message.command === RESP_CMD) && (message.type === REQUEST_TYPE)) {
            return registerChanged(message)
        } else {
            return Promise.resolve(false)
        }
    }
    const updateRegister = register => hasRegisterChanged(register)
        .then(changed => changed ? store.set(register) : false)

    const emitMessage = message => 
        hasRegisterChanged(message)
            .then(changed => changed ? ev.emit('message', {
                register: message.register,
                data: message.data
                }) : undefined)

    const addHandlers = () => {
        incomingMessageHandler.addHandler(acknowledgeHandler)
        incomingMessageHandler.addHandler(emitMessage)
        incomingMessageHandler.addHandler(updateRegister)
    }
    const start = () =>
        messaging.start()
            .then(() => {
                incomingMessageHandler.start()
                outgoingMessageHandler.start()

                addHandlers()
            })

    const stop = () =>
        messaging.stop()
            .then(() => {
                outgoingMessageHandler.stop()
                incomingMessageHandler.stop()
                ev.removeAllListeners()
            })
    ev.start = start
    ev.stop = stop
    ev.send = outgoingMessageHandler.send
    return ev
}

export default CarController 