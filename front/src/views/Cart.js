import './Cart.css'
import { useCart } from '../components/CartContext'
import CartItem from '../components/CartItem'
import React from 'react'

const Cart = ( { setCurrentModal }) => {
  
  const Cart = useCart()
  
  // формируем массив элементов корзины с информацией о товаре; используется хук useMemo, чтобы массив формировался только при изменении зависимостей, а не при каждом рендере
  const cartItems = React.useMemo(() => {
    const items = Cart.cartItems
    const products = Cart.cartProducts
    const array = []    
    items.forEach( i => {            
      const p = (id => products.find(p => id === p._id) )(i.id)      
      const n = { ...i, ...p }
      n.qty = n.qty ?? 0 
      n.price = n.price ?? 0 
      if(n.qty > 0 ) array.push(n)
    })    
    return array
  }, [Cart.cartItems, Cart.cartProducts])

  return (
    <main className="Cart">
      <div className="container container-x6">
        <h1 className="mb-4">Корзина</h1>
        { 
          Cart.isEmpty() ? 
          <>
          <h2>Корзина пустая</h2>
          </>
          :
          <>          
          <div className="CartItems p-4 gap-4 grid x2-grid-cols-2 x3-grid-cols-3 x4-grid-cols-4 x5-grid-cols-5">
          { cartItems.map( i => <CartItem key={i.id} id={i.id} qty={i.qty} title={i.title} price={i.price} img={i.img} /> ) } 
          </div>                                          
          </>
        }                
        <div className="SubTotals p-4">
        {           
          !Cart.isEmpty() &&
          <div>Итого: <strong>{ cartItems.reduce((a, i) => a + i.qty * i.price, 0).toFixed(2) } ₽</strong></div>
        }
          <button className="my-2 mx-1 px-2 py-1" disabled={Cart.isEmpty()} onClick={ () => Cart.clearCart() }>Очистить</button>
          <button className="my-2 mx-1 px-2 py-1" disabled={Cart.isEmpty()} onClick={ () => setCurrentModal('Payment') }>Оформить заказ</button>        
        </div>
      </div>
    </main>
  )
}

export default Cart