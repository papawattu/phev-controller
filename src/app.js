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
    
        carController.start()
 
        carController.on('message', message => {
            console.log(JSON.stringify(message))
            ws.send(JSON.stringify(message))
        })
        ws.on('message', data => {
            carController.send(JSON.parse(data))      
        })
        ws.on('close', () => {
            log.info('Connection closed')

            carController.stop()
        })
    })
}

export default App