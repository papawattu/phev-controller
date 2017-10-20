import { log } from 'phev-utils'
import CarController from './car-controller'
import RegisterStore from './register-store'
import HttpApiServer from './http-api-server'

const App = (
    {
        messaging, 
        carController = CarController({ messaging, store: RegisterStore() }), 
        httpApiServer = HttpApiServer(),
    } = {}) => {

    carController.start()
    httpApiServer.start()
    carController.on('connected', () => {

        httpApiServer.post('/send', (req, res) => {
            log.debug(`COMMAND Reg ${req.body.register}  Value ${req.body.value}`)
            carController.sendSimpleCommand(req.body.register, req.body.value)
                .then(register => {
                    res.sendStatus(200)
                },err => {
                    res.write(`Error ${err}`)
                    res.sendStatus(500)
                })
                .catch(err => {
                    log.error('Error ' + err)
                    res.sendStatus(500)
                })
                
        })

    })

    carController.on('disconnected', () => {
        log.info('Disconnected')
    })
    process.on('SIGINT', () => {
        log.info('Received SIGINT - Shutting down.')
        carController.stop()
            .then(() => process.exit(0))
    })


}

export default App