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

    const connected = () => {
        outgoingMessageHandler.startPingAndDateSync()
        ev.emit('connected')
    }

    const pendingCalls = []

    const onAcknowledge = (register, callback) => {
        pendingCalls.push({ register, callback })
    }
    const removeAcknowledge = x => {
        pendingCalls.pop()
    }
    const commandCallback = register => {
        pendingCalls.filter(reg => reg.register === register )
            .map((register,idx) => {
                register.callback(register)
            })
        }
    const {
        acknowledgeHandler,
        startResponseHandler,
        timeoutCheckHandler,
        startMessageTimeout,
        stopMessageTimeout,
        commandAcknowledgementHandler,
    } = Responder(
            {
                publish: message => outgoingMessageHandler.send(message),
                connected: () => connected(),
                timeout: () => timeout(),
                commandCallback: commandCallback
            })

    const restart = () => {
        stop()
            .then(() => start())
    }

    const timeout = () => {
        stopMessageTimeout()
        ev.emit('timeout')
        restart()
    }
    const registerChanged = register => new Promise((resolve, reject) => store.get(register.register)
        .then(reg => {
            if (reg === undefined) {
                return resolve(true)
            }

            if (reg.data.equals(register.data)) {
                return resolve(false)
            } else {
                return resolve(true)
            }
        }))

    const hasRegisterChanged = message => {
        if ((message.command === RESP_CMD) && (message.type === REQUEST_TYPE)) {
            return registerChanged(message)
        } else {
            return Promise.resolve(false)
        }
    }
    const updateRegisterHandler = register => hasRegisterChanged(register)
        .then(changed => changed ? store.set(register) : false)

    const emitMessageHandler = message =>
        hasRegisterChanged(message)
            .then(changed => changed ? ev.emit('message', {
                register: message.register,
                data: message.data
            }) : undefined)

    const addHandlers = () => {
        incomingMessageHandler.addHandler(timeoutCheckHandler)
        incomingMessageHandler.addHandler(startResponseHandler)
        incomingMessageHandler.addHandler(acknowledgeHandler)
        incomingMessageHandler.addHandler(emitMessageHandler)
        incomingMessageHandler.addHandler(updateRegisterHandler)
        incomingMessageHandler.addHandler(commandAcknowledgementHandler)
    }
    const start = () =>
        messaging.start()
            .then(() => {
                addHandlers()
                incomingMessageHandler.start()
                outgoingMessageHandler.start()
                connected()
                startMessageTimeout()
            })

    const stop = () =>
        messaging.stop()
            .then(() => {
                stopMessageTimeout()
                outgoingMessageHandler.stop()
                incomingMessageHandler.stop()
                ev.emit('disconnected')
                ev.removeAllListeners()
            })
    ev.start = start
    ev.stop = stop
    ev.sendSimpleCommand = outgoingMessageHandler.sendSimpleCommand
    ev.onAcknowledge = onAcknowledge
    return ev
}

export default CarController 