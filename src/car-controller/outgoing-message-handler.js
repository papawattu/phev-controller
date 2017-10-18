import { log, encode, buildMsg } from 'phev-utils'
import { DEFAULT_LENGTH, START_SEND, REQUEST_TYPE, SEND_CMD, EMPTY_DATA, PING_SEND_CMD } from './message-constants'
import codes from '../../codes'

const OutgoingMessageHandler = ({ messaging, mac = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00] }) => {

    let ping, date

    const send = message => messaging.publish(encode(message))

    const sendFullCommand = (register, data) => send(buildMsg(SEND_CMD)(REQUEST_TYPE)(register)(DEFAULT_LENGTH + data.length-1)(data))

    const sendSimpleCommand = (register, value) => send(buildMsg(SEND_CMD)(REQUEST_TYPE)(register)(DEFAULT_LENGTH)(Buffer.from([value])))
    
    const sendDateSync = date => sendFullCommand(codes.KO_WF_DATE_INFO_SYNC_SP,Buffer.from([date.getFullYear()-2000,date.getMonth()+1,date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds(),1]))

    const createPingRequest = num => buildMsg(PING_SEND_CMD)(REQUEST_TYPE)(num)(DEFAULT_LENGTH)(EMPTY_DATA)
    
    const pingMessage = num => send(createPingRequest(num))

    const startPing = ({ getCurrentPing }) => {
        log.debug('Started ping')
        return setInterval(() => {
            let lastPing = 0
            const currentPing = getCurrentPing()
            log.debug('Send ping num ' + getCurrentPing())
            if(currentPing !== lastPing) {
                pingMessage(currentPing)
                lastPing = currentPing
            } else {
                log.debug('Missed a ping')
            }
        },1000)
    }
    const startDateSync = () => {
        log.debug('Started Date synv')
        return setInterval(() => {
            const date = new Date()
            log.debug('Send date sync ' + date.toJSON())
            sendDateSync(date)
        },30000)
    }
    const start = () => {
        log.debug('Started outgoing message handler')

        send(buildMsg(START_SEND)(REQUEST_TYPE)(1)(10)(Buffer.from([2].concat(mac))))
        send(buildMsg(SEND_CMD)(REQUEST_TYPE)(0xaa)(DEFAULT_LENGTH)(EMPTY_DATA))
    }

    const startPingAndDateSync = ({ getCurrentPing }) => {
        ping = startPing({ getCurrentPing })
        date = startDateSync()
    }
    const stop = () => {
        clearInterval(ping)
        clearInterval(date)

        log.debug('Stopped outgoing message handler')
    }
    return {
        start,
        stop,
        send,
        sendFullCommand,
        sendSimpleCommand,
        startPingAndDateSync,
    }
}

export default OutgoingMessageHandler