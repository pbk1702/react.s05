import * as React from 'react'
import axios from 'axios'

// название ключа для токена в localStorage
const tokenStorageKey = 'token'
const baseURL = 'http://127.0.0.1:9001'

const getURL = (path) => baseURL.concat('/', path)

// получение токена из localStorage
const getToken = () => { 
    const k = tokenStorageKey
    return localStorage.getItem(k) 
}

// запись токена в localStorage
const saveToken = (v) => { 
    const k = tokenStorageKey
    // обновить localStorage
    if(!v) {
        console.log(`localStorage['${k}'] = null`)
        localStorage.removeItem(k)
    }
    else { 
        localStorage.setItem(k, v) 
        console.log(`localStorage['${k}'] = '${v}'`)
    }    
}

// инициализация значений заголовков по умолчанию в axios 
axios.defaults.baseURL = baseURL
// автоматически добавляем заголовки с токеном в запросы к серверу
axios.interceptors.request.use(function(config){
    const token = getToken()
    if(token) config.headers = Object.assign(config.headers, {'Authorization': `Bearer ${token}`})
    return config
}, function(error) {
    return Promise.reject(error)
})
// автоматически обновляем токен при получении ответов сервера
axios.interceptors.response.use(function(res) {
    // функция изменения токена из react context
    const setToken = axios.interceptors.setToken
    // устанавливаем токен, если ответ сервера содержит его
    const token = res.data?.auth?.token
    if(token) setToken(token)
    // убираем токен, если ответ сервера без информации об успешной аутентификации пользователя
    const auth = res.data?.auth
    if(!auth && getToken()) { 
        console.log('Пользователь на сервере не авторизован. Обнуляем токен.')
        setToken(null) 
    }
    // удаляем раздел auth в ответе сервера
    delete res.data?.auth 
    // выходим из обработчика 
    return res 
}, function(err) {
    const setToken = axios.interceptors.setToken 
    // убираем токен, если ответ сервера без информации об успешной аутентификации пользователя            
    const res = err.response
    // если ответ сервера содержит сообщение об ошибке, добавляем его в объект ошибки 
    const error = res?.data?.error    
    if(error) err.error = error
    // проверяем наличие авторизации
    // если авторизации в ответе сервера нет, обнуляем токен
    const auth = res?.data?.auth 
    if(!auth && getToken()) { 
        console.log('Пользователь на сервере не авторизован. Обнуляем токен.')
        setToken(null)
    }
    // удаляем раздел auth в ответе сервера
    delete res?.auth
    // выходим из обработчика
    return Promise.reject(err)
})    

const AuthContext = React.createContext()

const AuthProvider = ({children}) => {
    const [token, setToken] = React.useState(getToken())

    // если токен авторизации отсутствует, то пользователь расценивается как гость 
    const isGuest = () => !token

    // Настраиваем axios
    axios.interceptors.setToken = setToken

    // при обновлении токена в реакте, обновляем токен в localStorage
    React.useEffect( () => { saveToken(token) }, [token] )

    // регистрация
    const changePassword = (input) =>  {
    console.log('changePassword')
    return axios.post('/changePassword', input)
    }

    // регистрация
    const register = (params) =>  {
        console.log('register')
        return axios.post('/register', params)
    }

    // вход в систему
    const login = (params) => {
        console.log('login')
        return axios.post('/login', params)
    }

    // выход из системы
    const logout = () => { 
        console.log('logout') 
        setToken(null)
    }
    
    // обновляем значение только при изменении token
    // React.useMemo( () => ( { token, setToken} ), [token] )
    const contextValue = Object.assign({ isGuest, changePassword, register, login, logout }) 
    
    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    )
}

function useAuth() {
    const context = React.useContext(AuthContext)
    if(context === undefined)
        throw new Error('useAuth must be used within a AuthProvider')
    return context
}

export { useAuth, AuthProvider, getURL }