import React from 'react'
import './Register.css'
import { useAuth } from './AuthContext'

const Register = ( {closeModal} ) => {

    const Auth = useAuth()

    const [error, setError] = React.useState(null)

    const mainAction = (event) => {
        event.preventDefault()
        const form = document.querySelector('form.FormRegister')        
        const login = form.querySelector('input[name="login"]').value
        const password = form.querySelector('input[name="password"]').value          
        const email = form.querySelector('input[name="email"]').value          
        Auth.register({ login, password, email })
        .then(res => { 
            const s = res.data.message
            console.log(s) 
            alert(s)
            setError(null)
            closeModal()
        })
        .catch(e => setError(e.error ? new Error(e.error) : e))
    }

    return (
        <>
        <form className='FormRegister' onSubmit={mainAction}>
            <h2 className="mb-2">Регистрация</h2>
            { Auth.isGuest() ? 
            <>
            <input id="login" type="text" name="login" placeholder='Логин' />
            <input id="email" type="email" name="email" placeholder='Эл. почта' />
            <input id="password" type="password" name="password" placeholder='Пароль' />
            <button>Регистрация</button>
            { error && <p className='error'>&#9888; { error.message }</p> }
            </>
            :
            <>
            <h3>Для регистрации нового пользователя необходимо сначала выйти из системы (Logout)</h3>
            </>
            }
        </form>
        </>
  )
}

export default Register;

 