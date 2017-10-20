import EventEmitter from 'events'

const MessagingClient = ({ee = new EventEmitter(), handlers = [], events =[]} = {}) => ({
    start: () => Promise.resolve(),
    stop: () => Promise.resolve(),
    registerHandler: handler => ee.addListener('incoming',handler),
    publish: message => {
        events.push(message)
        ee.emit('outgoing',message)
    },
    eventEmitter: ee,
    events: events,
})

export default MessagingClient
