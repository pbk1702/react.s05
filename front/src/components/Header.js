import './Header.css';
import UserBox from './UserBox';

const Header = ({ currentView, setCurrentView, setCurrentModal }) => {
    return (
    <header className="Header">  
      <div className="container container-xl">
      { 
        // отображаем "Добавить товар" только если теущая страница = страница просмотра товаров
        (currentView === 'Main') &&
        <li onClick={() => setCurrentModal('ProductAdd')}>Добавить товар</li>           
      }
      <li onClick={() => setCurrentView('Main')}>Главная</li>        
      <li onClick={() => setCurrentView('Cart')}>Корзина</li>                        
      <UserBox setCurrentView={setCurrentView} setCurrentModal={setCurrentModal} />
      </div> 
    </header>
  )
}

export default Header;
