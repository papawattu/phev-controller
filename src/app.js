import { log } from 'phev-utils'
import CarController from './car-controller'
import RegisterStore from './register-store'
import WebSocket from 'ws'
import Express from 'express'
import Http from 'http'

const App = ({ messaging, carController = CarController({ messaging, store: RegisterStore() }) } = {}) => {

    carController.start()

    carController.on('timeout', () => {
        log.warn('TIMEOUT')
    })
    carController.on('disconnected', () => {
        log.info('Stopped')
    })
    process.on('SIGINT', () => {
        log.info('Received SIGINT - Shutting down.')
        carController.stop()
            .then(() => process.exit(0))
    })
}

export default App