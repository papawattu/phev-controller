import IncomingMessageHandler from './incoming-message-handler'
import OutgoingMessageHandler from './outgoing-message-handler'
import Responder from './responder'
import RegisterStore from './register-store'

const CarController = ({
    messaging,
    incomingMessageHandler = IncomingMessageHandler({ messaging }),
    outgoingMessageHandler = OutgoingMessageHandler({ messaging }),
} = {}) => {

    const { set, display } = RegisterStore()
    const responder = Responder({ messaging })

    const updateRegister = register => set(register)

    setInterval(() => display(),5000)
    const addHandlers = () => {
        incomingMessageHandler.addHandler(responder.acknowledgeHandler)
        incomingMessageHandler.addHandler(updateRegister)
    }
    const start = () =>
        messaging.start()
            .then(() => {
                incomingMessageHandler.start()
                outgoingMessageHandler.start()

                addHandlers()
            })
    return {
        start
    }
}

export default CarController 