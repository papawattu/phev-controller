import { log, encode, buildMsg } from 'phev-utils'
import { DEFAULT_LENGTH, START_SEND, REQUEST_TYPE, SEND_CMD, EMPTY_DATA, PING_SEND_CMD } from './message-constants'
import codes from '../../codes'

const OutgoingMessageHandler = ({ messaging, mac = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00] }) => {

    const send = message => messaging.publish(encode(message))

    const sendFullCommand = (register, data) => {
        const msg = buildMsg(SEND_CMD)(REQUEST_TYPE)(register)(DEFAULT_LENGTH + data.length-1)(data)
        send(msg)
    }
    const sendSimpleCommand = (register, value) => {
        const msg = buildMsg(SEND_CMD)(REQUEST_TYPE)(register)(DEFAULT_LENGTH)(Buffer.from([value]))
        send(msg)
    }
    const sendDateSync = date => sendFullCommand(codes.KO_WF_DATE_INFO_SYNC_SP,Buffer.from([date.getFullYear()-2000,date.getMonth()+1,date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds(),1]))

    const createPingRequest = num => buildMsg(PING_SEND_CMD)(REQUEST_TYPE)(num)(DEFAULT_LENGTH)(EMPTY_DATA)
    
    const pingMessage = num => send(createPingRequest(num))

    const startPing = () => {
        let num = 0
        setInterval(() => {
            pingMessage(num)
            num = (num + 1) % 100 
        },1000)
    }
    const startDateSync = () => {
        let num = 0
        setInterval(() => {
            sendDateSync(new Date())
        },30000)
    }
    const start = () => {
        log.debug('Started outgoing message handler')

        send(buildMsg(START_SEND)(REQUEST_TYPE)(1)(10)(Buffer.from([2].concat(mac))))
        send(buildMsg(SEND_CMD)(REQUEST_TYPE)(0xaa)(DEFAULT_LENGTH)(EMPTY_DATA))
        startPing()
        startDateSync()
    }

    return {
        start,
        send,
    }
}

export default OutgoingMessageHandler