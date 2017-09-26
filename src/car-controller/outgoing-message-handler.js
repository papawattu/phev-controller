import { encode, buildMsg } from 'phev-utils'
import { DEFAULT_LENGTH, START_SEND, REQUEST_TYPE, SEND_CMD, EMPTY_DATA } from './message-constants'

const OutgoingMessageHandler = ({ messaging, mac = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00] }) => {

    const send = message => messaging.publish(encode(message))

    const start = () => {
        send(buildMsg(START_SEND)(REQUEST_TYPE)(1)(10)(Buffer.from([2].concat(mac))))
        send(buildMsg(SEND_CMD)(REQUEST_TYPE)(0xaa)(DEFAULT_LENGTH)(EMPTY_DATA))
    }

    return {
        start,
        send,
    }
}

export default OutgoingMessageHandler