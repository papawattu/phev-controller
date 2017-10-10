import { log, buildMsg, encode, decode, validate, toMessageArray } from 'phev-utils'
import { DEFAULT_LENGTH, EMPTY_DATA, REQUEST_TYPE, RESP_CMD, START_RESP, RESPONSE_TYPE, PING_RESP_CMD } from './message-constants'

const TIMEOUT = 60000
const TIMEOUT_CHECK_INTERVAL = 5000

const Responder = ({ publish, connected, timeout, commandCallback, pingCallback }) => {

    let lastMessageTime = undefined
    let timeoutInterval = undefined

    const swapNibble = byte => ((byte & 0xf) << 4) | ((byte & 0xf0) >> 4)

    const acknowledgeResponse = message => buildMsg(swapNibble(message.command))(!message.type & 1)(message.register)(DEFAULT_LENGTH)(EMPTY_DATA)

    const acknowledgeHandler = message => {

        if (message.type === REQUEST_TYPE && message.command === RESP_CMD) {
            publish(acknowledgeResponse(message))
        }
    }

    const commandAcknowledgementHandler = message => 
        message.type === RESPONSE_TYPE && message.command === RESP_CMD ? commandCallback(message.register) : undefined
    
        const startResponseHandler = message => {

        if (message.command === START_RESP && message.type === RESPONSE_TYPE && message.register === 1) {
            connected()
        }
    }
    const updateMessageTime = () => {
        return Date.now() + TIMEOUT
    }
    const startMessageTimeout = () => {

        lastMessageTime = updateMessageTime()
        timeoutInterval = setInterval(() => {
            log.debug('Timeout check')
            if (lastMessageTime < Date.now()) {
                log.error('Connection timeout')
                lastMessageTime = updateMessageTime()
                timeout()
            }
        }, TIMEOUT_CHECK_INTERVAL)
    }

    const stopMessageTimeout = () => {
        clearInterval(timeoutInterval)
    }

    const timeoutCheckHandler = message => lastMessageTime = updateMessageTime()

    const isPingResponse = message => message.command === PING_RESP_CMD && message.type === RESPONSE_TYPE
    
    const pingResponseHandler = message => isPingResponse(message) ? pingCallback(message.register) : message
    
    return {
        acknowledgeHandler,
        startResponseHandler,
        timeoutCheckHandler,
        startMessageTimeout,
        stopMessageTimeout,
        commandAcknowledgementHandler,
        pingResponseHandler,
    }
}

export default Responder