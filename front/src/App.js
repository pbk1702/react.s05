import React from 'react'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Main from './views/Main'
import Cart from './views/Cart'
import UserProfile from './views/UserProfile'
import ModalBox from './components/ModalBox'
import Login from './components/Login'
import Register from './components/Register'
import Payment from './components/Payment'
import ProductAdd from './components/ProductAdd'
import { AuthProvider } from './components/AuthContext'
import { CartProvider } from './components/CartContext'

const App = () => {  
  
  const [currentView, setCurrentView] = React.useState('Main')
  const [currentModal, setCurrentModal] = React.useState('None')

  const views = {
    Main: <Main />,
    Cart: <Cart setCurrentModal={setCurrentModal}/>,
    UserProfile: <UserProfile />,
  }

  const modals = {
    None: null,
    Register: <ModalBox setCurrentModal={setCurrentModal}><Register /></ModalBox>,
    Login: <ModalBox setCurrentModal={setCurrentModal}><Login /></ModalBox>,
    Payment: <ModalBox setCurrentModal={setCurrentModal}><Payment /></ModalBox>,
    ProductAdd: <ModalBox setCurrentModal={setCurrentModal}><ProductAdd /></ModalBox>,
  }

  return (
    <div className="App grid auto-rows_auto-1fr-auto">
      <AuthProvider>        
        <Header currentView={ currentView } setCurrentView={ setCurrentView } setCurrentModal={ setCurrentModal } />        
          <CartProvider>
            { views[currentView] }
          </CartProvider>
        <Footer />
        { modals[currentModal] }
      </AuthProvider>
    </div>
  )
}

export default App
