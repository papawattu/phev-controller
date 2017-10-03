import { log } from 'phev-utils'
import CarController from './car-controller'
import RegisterStore from './register-store'
import WebSocket from 'ws'
import Express from 'express'
import Http from 'http'
import bodyParser from 'body-parser'
import cors from 'cors'

const App = ({ messaging, carController = CarController({ messaging, store: RegisterStore() }) } = {}) => {

    const express = Express()

    express.use(bodyParser.json())
    express.use(bodyParser.urlencoded({ extended: true }))
    express.use(cors())

    const server = express.listen(8080, () => {
        log.info('Endpoints started on port ' + server.address().port)
    })

    carController.start()

    carController.on('connected', () => {

        express.post('/send', (req, res) => {
            log.debug(`COMMAND Reg ${req.body.register}  Value ${req.body.value}`)
            carController.sendSimpleCommand(req.body.register, req.body.value)
            res.sendStatus(200)
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