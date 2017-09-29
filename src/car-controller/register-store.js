const RegisterStore = register => {
    const store = new Array(255)

    return {
        set: register => store[register.register] = { register: register.register, data: register.data },
        display: () => store.forEach(reg => reg != null ? console.log(JSON.stringify(reg)) : '')
    }
}

export default RegisterStore