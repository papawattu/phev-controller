import { log, buildMsg, encode, decode, validate, toMessageArray } from 'phev-utils'
import { DEFAULT_LENGTH, EMPTY_DATA, REQUEST_TYPE, RESP_CMD } from './message-constants'

const Responder = ({ messaging }) => {

    const swapNibble = byte => ((byte & 0xf) << 4) | ((byte & 0xf0) >> 4)

    const acknowledgeResponse = message => buildMsg(swapNibble(message.command))(!message.type & 1)(message.register)(DEFAULT_LENGTH)(EMPTY_DATA)

    const acknowledgeHandler = message => {

        if (message.type === REQUEST_TYPE && message.command === RESP_CMD) {
            messaging.publish(encode(acknowledgeResponse(message)))
        }
    }
    return {
        acknowledgeHandler,
    }
}

export default Responder