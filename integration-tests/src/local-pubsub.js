import EventEmitter from 'events'

const MessagingClient = ({ee = new EventEmitter(), handlers = []} = {}) => ({
    start: () => Promise.resolve(),
    stop: () => Promise.resolve(),
    registerHandler: handler => ee.addListener('incoming',handler),
    publish: message => ee.emit('outgoing',message),
    eventEmitter: ee
})

export default MessagingClient
