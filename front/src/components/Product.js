import './Product.css';
import { useCart } from './CartContext'
import { getURL } from './AuthContext'

const Product = ({ id, title, img, price }) => {
  
  const { addToCart } = useCart()

  return (
    <div className="Product gap-4 p-4 flex flex-col justify-between">
      <img className="" alt={title} title={title} src={getURL(img)} />
      <div className="flex flex-col gap-2">
        <strong>{title}</strong>
        <p>{ `${ (price ?? 0).toFixed(2) } руб` }</p>
        <button className="px-2 py-1" onClick={ () => addToCart(id) }>В корзину</button>
      </div>
    </div>
  )
}

export default Product;
