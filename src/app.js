import PubSub from '@google-cloud/pubsub'
import { log } from 'phev-utils'
import CarController from './car-controller'

const App = ({ carController = CarController()}) => {

    carController.start()
}

export default App