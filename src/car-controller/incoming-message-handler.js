import { log, buildMsg, encode, decode, validate, toMessageArray } from 'phev-utils'
import { DEFAULT_LENGTH, EMPTY_DATA } from './message-constants'

const IncomingMessageHandler = ({ messaging }) => {

    const swapNibble = byte => ((byte & 0xf) << 4) | ((byte & 0xf0) >> 4)
    
    const defaultResponse = message => buildMsg(swapNibble(message.command))(!message.type & 1)(message.register)(DEFAULT_LENGTH)(EMPTY_DATA)
    
    const acknowledgeHandler = message => {
        messaging.publish(encode(defaultResponse(message)))
    }
    const logger = message => {
        log.debug(JSON.stringify(message))
    }
    const handlers = [
        acknowledgeHandler,
        logger
    ]

    const handler = message => {
        toMessageArray(message).map(decode).forEach(msg => handlers.forEach(handler => handler(msg)))
    }
    const start = () => {
        messaging.registerHandler(handler)
    }

    return {
        start: () => start()
    }
}

export default IncomingMessageHandler