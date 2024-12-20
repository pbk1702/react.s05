import './CartItem.css';
import { useCart } from './CartContext'
import { getURL } from './AuthContext'

const CartItem = ({ id, qty, title, price, img }) => {
  const Cart = useCart()

  return (
    <div className="CartItem flex flex-col gap-4 p-4 justify-between" data-id={id}>        
        <img className="" alt={title} title={title} src={getURL(img)} />
        <div className="flex flex-col gap-1">
          <strong>{title}</strong>
          <p>Цена: { price.toFixed(2) } ₽</p>
          <p>Количество: {qty}</p>
          <p>Сумма: { (price * qty).toFixed(2) } ₽</p>
          <div className="flex flex-row gap-1 justify-center">
            <button className="py-1 px-2" onClick={ () => Cart.subFromCart(id) }>-</button>
            <button className="py-1 px-2" onClick={ () => Cart.addToCart(id) }>+</button>
            <button className="py-1 px-2" onClick={ () => Cart.remFromCart(id) }>x</button>
          </div>
        </div>
    </div>
  )
}

export default CartItem
