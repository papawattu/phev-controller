const RegisterStore = register => {
    const store = new Array(255)

    return {
        set: register => store[register.register] = { register: register.register, data: register.data },
        get: id => Promise.resolve(store[id]),
        display: () => store.forEach(reg => reg != null ? console.log(JSON.stringify(reg)) : '')
    }
}

export default RegisterStore