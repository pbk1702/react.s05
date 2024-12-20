import React, {useState, useEffect} from 'react'
import './Main.css'
import Product from '../components/Product'
import axios from 'axios'

const Main = () => {

  const[products, setProducts] = useState([])

  const isEmpty = () => products.length === 0

  useEffect(() => { 
    console.log('Запрашиваем список продуктов с сервера')
    axios.get('/products').then( res => {      
      setProducts(res.data.products)
    }).catch( e => console.dir(e))
  }, [])
  
  return (
    <main className="Main">
      <div className="container container-x6">
        <h1 className="mb-4">Главная</h1>
        { 
        isEmpty() ?
        <>
        <h2>Список товаров пуст</h2>
        </>
        :
        <>     
        <div className="Products p-4 gap-4 grid grid-cols-1 x2-grid-cols-2 x3-grid-cols-3 x4-grid-cols-4 x5-grid-cols-5">
        { products.map ( i => <Product key={i._id} id={i._id} title={i.title} price={i.price} img={ i.img }/> ) }
        </div>
        </>
        }
      </div>
    </main>
  )
}

export default Main