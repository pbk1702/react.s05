import React from 'react'
import './UserProfile.css'
import { useAuth } from '../components/AuthContext'
import axios from 'axios'

const UserProfile = () => {
    
    const Auth = useAuth()

    const [error, setError] = React.useState(null)
    
    const[user, setUser] = React.useState([])

    React.useEffect(() => {     
      console.log('Запрашиваем данные пользователя с сервера')
      axios.get('/user').then( res => {
        setUser(res.data.user)
      }).catch( e => console.dir(e))
    }, [])

    const mainAction = (event) => {
        event.preventDefault()
        const form = document.querySelector('form.changePassword')
        const password = form.querySelector('input[name="password"]').value
        const newPassword = form.querySelector('input[name="newPassword"]').value
        const confirmPassword = form.querySelector('input[name="confirmPassword"]').value
        if(password === newPassword) {
            setError(new Error("Новый пароль должен отличаться от старого"))
            return
        }
        if(newPassword !== confirmPassword) {
            setError(new Error("Пароли не совпадают"))
            return 
        }
        Auth.changePassword({ password, newPassword })
        .then(res => { 
            const s = 'Пароль успешно изменен'
            console.log(s)
            alert(s)
            setError(null)
        })
        .catch(e => setError(e.error ? new Error(e.error) : e))
    }

    return (
        <main className="UserProfile">
            <div className="container container-x6">
                <h2 className="mb-2">Личный кабинет</h2>
                { !Auth.isGuest() ?
                <>
                <div className="p-4">
                    <div className="my-1">id: <strong>{user.id}</strong></div>
                    <div className="my-1">Имя пользователя: <strong>{user.login}</strong></div>
                    <div className="my-1">Эл. почта: <strong>{user.email}</strong></div>                
                </div>
                <form className='changePassword p-4' onSubmit={mainAction}>
                    <h3>Изменить пароль</h3>                    
                    <input className="mt-2" id="password" type="password" name="password" placeholder='Текущий пароль' />
                    <br />
                    <input className="mt-2" id="newPassword" type="password" name="newPassword" placeholder='Новый пароль' />
                    <br />
                    <input className="mt-2" id="confirmPassword" type="password" name="confirmPassword" placeholder='Новый пароль (ещё раз)' />
                    <br />
                    <button className="mt-2 py-1 px-2">Отправить</button>
                    { error && <p className='error'>&#9888; { error.message }</p> }
                </form>
                </>
                :
                <>
                <h3>Для просмотра личного кабинета необходимо авторизоваться</h3>
                </>
                }
            </div>
        </main>
    )
}

export default UserProfile
