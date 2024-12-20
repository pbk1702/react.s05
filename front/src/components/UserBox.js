import './UserBox.css';
import { useAuth } from './AuthContext'

const UserBox = ({ setCurrentModal, setCurrentView }) => {
  const Auth = useAuth()  
  return (
    <div className="UserBox"> 
    { 
      Auth.isGuest() ?
      <>
        <button onClick={ () => setCurrentModal('Login') }>Вход</button>
        <button onClick={ () => setCurrentModal('Register') }>Регистрация</button>
      </>
      :
      <>
                    
        <button onClick={ () => setCurrentView('UserProfile') }>Профиль</button>        
        <button onClick={ () => Auth.logout() }>Выход</button>
      </>
    }
    </div>
  )
}

export default UserBox;
