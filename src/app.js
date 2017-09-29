import { log } from 'phev-utils'
import CarController from './car-controller'

const App = ({ messaging, carController = CarController({ messaging }) } = {}) => {

    carController.start()
}

export default App