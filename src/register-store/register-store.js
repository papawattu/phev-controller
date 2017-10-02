import firebase from 'firebase'

firebase.initializeApp({
    apiKey: 'AIzaSyDo4HOpjUvts6hLHOjDD4ehSkJzUXykNyE', 
    authDomain: 'phev-db3fa.firebaseapp.com',        
    databaseURL: 'https://phev-db3fa.firebaseio.com',
    projectId: 'phev-db3fa',
    storageBucket: 'phev-db3fa.appspot.com',
    messagingSenderId: '557258334399'
  });

const RegisterStore = register => {
    const store = new Array(255)

    return {
        set: register => {
            const reg = firebase.database().ref('registers').child(register.register)
            
            store[register.register] = { data: register.data }
            
            reg.set({ data: register.data, updated: new Date().toJSON() })
        },   
        get: id => {
            return Promise.resolve(store[id])    
        },
    }
}

export default RegisterStore