import { log } from 'phev-utils'
import Express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

let server = null
const Server = ({ express = Express() } = {}) => ({
    start: () => {
        
        express.use(bodyParser.json())
        express.use(bodyParser.urlencoded({ extended: true }))
        express.use(cors())

        server = express.listen(8081, () => {
            log.info('Endpoints started on port ' + server.address().port)
        })

    },
    stop: () => { 
        server.close()
    },
    post: (endpoint, cb) => server.post(endpoint, cb),
})

export default Server