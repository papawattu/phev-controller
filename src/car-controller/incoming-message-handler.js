import { log, buildMsg, encode, decode, validate, toMessageArray } from 'phev-utils'
import { DEFAULT_LENGTH, EMPTY_DATA, REQUEST_TYPE, RESP_CMD } from './message-constants'

const IncomingMessageHandler = ({ messaging }) => {

    const logger = message => {
        log.debug('Incoming Message :' + JSON.stringify(message))
    }
    const handlers = [
        logger
    ]

    const handler = message => {
        toMessageArray(message).map(decode).forEach(msg => handlers.forEach(handler => handler(msg)))
    }
    const start = () => {
        log.debug('Started incoming message handler')
        messaging.registerHandler(handler)
    }

    const addHandler = handler => handlers.indexOf(handler) < 0 ? handlers.push(handler) : undefined
    
    return {
        start,
        addHandler,
    }
}

export default IncomingMessageHandler