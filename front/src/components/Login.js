import React from 'react'
import './Login.css'
import { useAuth } from './AuthContext'

const Login = ( { closeModal }) => {    
    const Auth = useAuth()

    const [error, setError] = React.useState(null)

    const mainAction = (event) => {        
        const form = document.querySelector('.FormLogin')        
        const login = form.querySelector('input[name="login"]').value
        const password = form.querySelector('input[name="password"]').value  
        event.preventDefault()
        Auth.login( { login, password } )
        .then( res => {
            const s = res.data.message
            console.log(s)
            alert(s)
            setError(null)
            closeModal()
        })
        .catch(e => setError(e.error ? new Error(e.error) : e))
    }

    return (
        <form className='FormLogin' onSubmit={mainAction}>
            <h2 className="mb-2">Логин</h2>
            { Auth.isGuest() ? 
            <>
            <input type="text" name="login" placeholder='login' required/>
            <input type="password" name="password" placeholder='password'/>
            <button>Войти</button>
            { error && <p className='error'>&#9888; { error.message }</p> }
            </>
            :
            <>
            <h3>Для входа в систему (Login) необходимо сначала выйти (Logout)</h3>
            </>
            }
        </form>
  );
}

export default Login;

 