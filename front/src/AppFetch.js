/*
import * as Auth from './Auth.js'
import axios from 'axios'

//axios.interceptors.response.use()
// подключаем обработчик обновления токена

function addAuthHeaders(req) {
    const token = Auth.getToken()
    if(token) console.log (`current token=${token}`)
    if(token) req.headers.append('Authorization','Bearer ' + token)
    return req
}

const processAuth = (res) => {
    if(res && res.auth && res.auth.user){
        const user = res.auth.user
        console.log(user)
        localStorage.setItem('user', user)
    }    
}

const getProductsRequest = () => {
    const url = 'http://localhost:9001/products'
    return addAuthHeaders(new Request(url))
}

const login = (user, password) => {
    // const data = { 
    //     user: user,
    //     password: password,
    // }

    // const url = 'http://localhost:9001/login'
    // fetch(url, { 
    //     method: 'POST', 
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data),
    // })
    // .then(res => res.json())
    // .then(res => { 
    //     console.log(res)
    //     // setToken(res)
    // })
}

const register = (user, password, email) => {
    // const data = {
    //     user: user,
    //     password: password,
    //     email: email,
    // }
    // console.log(data)
    // const url = 'http://localhost:9001/register'
    // fetch(url, { 
    //     method: 'POST', 
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(addToken(data)),
    // })
    // .then(res => res.json())
    // .then(res => { 
    //     console.log(res)
    //     res.setToken(res)
    // })
}

*/