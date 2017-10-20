import { log, buildMsg, encode, decode, validate, toMessageArray } from 'phev-utils'
import { DEFAULT_LENGTH, EMPTY_DATA, REQUEST_TYPE, RESP_CMD } from './message-constants'

const IncomingMessageHandler = ({ messaging }) => {

    const logger = message => {
        log.debug('Incoming Message :' + JSON.stringify(message))
    }
    
    const HandlerManager = handlers => ({
        addHandler: handler => handlers.indexOf(handler) < 0 ? handlers.push(handler) -1 : undefined,
        removeHandler: handler => handlers.indexOf(handler) >= 0 ? handlers.splice(handlers.indexOf(handler),1) : undefined,
        handle: message => toMessageArray(message).map(decode).forEach(msg => handlers.forEach(handler => handler(msg)))
    })

    const { addHandler, removeHandler, handle } = HandlerManager([logger])
    
    const start = () => {
        log.debug('Started incoming message handler')

        messaging.registerHandler(handle)
    }
    const stop = () => undefined

    return {
        start,
        addHandler,
        removeHandler,
        stop,
    }
}

export default IncomingMessageHandler