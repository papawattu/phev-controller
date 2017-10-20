const LocalStore = ({store = new Map()} = {}) => ({
    set: (key, value) => store.set(key, value),
    get: key => store.get(key)
})

export default LocalStore