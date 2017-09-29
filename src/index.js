const mqttUri = process.env.MQTT_URI || 'mqtt://secure.wattu.com'

require('./app').default({ messaging: require('phev-messaging').MqttClient({ mqttUri, topicName: 'phev/send', subscriptionName: 'phev/receive' }) })