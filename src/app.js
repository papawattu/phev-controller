import { log } from 'phev-utils'
import CarController from './car-controller'
import RegisterStore from './register-store'
import WebSocket from 'ws'
import Express from 'express'
import Http from 'http'

const App = ({ messaging, carController = CarController({ messaging, store: RegisterStore() }) } = {}) => {

    const express = Express()
    
    const server = Http.createServer(express)
    const wss = new WebSocket.Server({ server })
    
    server.listen(8080, () => {
        log.info(`Listening on port ${server.address().port}`)
    })

    wss.on('connection', ws => {
        log.info('WS Connection opened')
        carController.start()
        
        carController.on('timeout', () => {
            console.log('TIMEOUT')
        })
        carController.on('disconnected', () => {
            console.log('Stopped')
        })
        carController.on('connected', () => {
            carController.on('message', message => {
                log.debug('WS outgoing message : ' + message)
                ws.send(JSON.stringify(message))
            })
            ws.on('message', data => {
                log.debug('WS incoming message : ' + data)
                const command = JSON.parse(data)

                carController.sendSimpleCommand(command.register,command.value)      
            })
            ws.on('close', () => {
                log.info('WS Connection closed')
    
                carController.stop()
            })
        })
    })
}

export default App