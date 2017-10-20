import EventEmitter from 'events'

const MessagingClient = ({ee = new EventEmitter(), handlers = []} = {}) => ({
    start: () => Promise.resolve(),
    stop: () => Promise.resolve(),
    registerHandler: handler => ee.addListener('message',handler),
    publish: message => ee.emit('message',message)
})

export default MessagingClient
