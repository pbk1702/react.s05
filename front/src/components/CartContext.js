import * as React from 'react'
import axios from 'axios'

const CartContext = React.createContext()

const CartProvider = ({children, storeKey}) => {  

    const [cartItems, setCartItems] = React.useState([])    
    const cartStoreKeyPrefix  = 'cart'

    // загружаем содержимое корзины из localStorage
    React.useEffect(() => {                
        // loadCartItems()
        console.log(`useEffect(storeKey) : loadCartItems()`)   
        const k = cartStoreKeyPrefix + (storeKey ? storeKey : '')
        const cartItems = JSON.parse(localStorage.getItem(k))
        if(cartItems && Array.isArray(cartItems)) 
            setCartItems(cartItems)
        else
            setCartItems([])
        }
    , [storeKey])
    
    // сохраняем содержимое корзины в localStorage
    React.useEffect( () => {         
        // saveCartItems()
        console.log(`useEffect(setCartItems) : saveCartItems()`)
        const k = cartStoreKeyPrefix + (storeKey ? storeKey : '')                
        if(Array.isArray(cartItems) && cartItems.length > 0) {
            console.log(`saveCartItems(): length = ${cartItems.length}`)
            localStorage.setItem(k, JSON.stringify(cartItems))
        }
        else localStorage.removeItem(k)        
        // запрашиваем информацию с сервера о продуктах, которые есть в корзине
        const ids = cartItems.map( (i) => i.id )
        axios.post('/products', ids)
        .then(             
            res => setProducts(res.data.products)
        )
        .catch( err => console.log(err) )         
    }
    , [cartItems, storeKey] )

    // данные о товарах
    const [products, setProducts] = React.useState([])  

    // Очищаем корзину
    const clearCart = () => {
        console.log('clearCart()')
        setCartItems([])
    }

    // возвращает пустая ли корзина
    const isEmpty = () => 0 === cartItems.length

    // универсальная процедура обновления элемента корзины
    const updateCartItem = (id, qty = 1, remove = false) => {
        console.log(`updateCartItem(${id}, ${qty}, ${remove})`)
        const items = cartItems
        console.log('cartItems:')
        console.dir(cartItems)
        const item = items.find((i) => i.id === id)
        const now = Date.now()
        // существующий элемент корзины
        if(item) {
            const newQty = item.qty += qty            
            // обновляем существующий элемент корзины
            if(!remove && newQty > 0) { 
                item.updatedOn = now
                item.qty = newQty 
            }
            // удаляем элемент корзины, если количество меньше нуля или запрос на удаление
            if(remove || newQty <= 0) items.splice(items.indexOf(item), 1)
        }
        // новый элемент корзины
        if(!item) { 
            const newQty = qty
            // добавляем новый элемент корзины
            if(!remove && newQty > 0) {
                items.push( { id: id, qty: qty, createdOn: now, updatedOn: now } )                
            }
        }
        // присваиваем новый массив, отсортированный в порядке обновления
        setCartItems( items.toSorted( (a, b) => b.createdOn - a.createdOn ) )
    }

    // добавить 1 шт товара в корзину
    const addToCart = (id) => updateCartItem(id, 1, false)

    // удалить 1 шт товара из корзины
    const subFromCart = (id) => updateCartItem(id, -1, false)

    // удалить строку товара из корзины
    const remFromCart = (id) => updateCartItem(id, 0, true)

    // экспортируемое контекстом
    const contextValue = { cartProducts: products, cartItems, addToCart, subFromCart, remFromCart, clearCart, isEmpty }

    return (
        <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
    )
}

function useCart() {
    const context = React.useContext(CartContext)
    if(context === undefined)
        throw new Error('useCart must be used within a CartProvider')
    return context
}

export { CartProvider, useCart } 