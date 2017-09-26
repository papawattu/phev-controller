import IncomingMessageHandler from './incoming-message-handler'
import OutgoingMessageHandler from './outgoing-message-handler'

const CarController = ({ 
    messaging, 
    incomingMessageHandler = IncomingMessageHandler({ messaging }),
    outgoingMessageHandler = OutgoingMessageHandler({ messaging }), 
} = {}) => {

    return {
        start: () => 
            messaging.start()
                .then(() => {
                    incomingMessageHandler.start()
                    outgoingMessageHandler.start()
                })
    }
}

export default CarController 