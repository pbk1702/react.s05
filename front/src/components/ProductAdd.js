import React from 'react'
import './ProductAdd.css'
import { useAuth } from './AuthContext'
import axios from 'axios'

const ProductAdd = ( { closeModal }) => {
    
    const [error, setError] = React.useState(null)

    const Auth = useAuth()

    const mainAction = (event) => {        
        const form = document.querySelector('.FormProductAdd')
        const title = form.querySelector('input[name="title"]').value        
        const price = form.querySelector('input[name="price"]').value
        const img = form.querySelector('input[name="img"]').value
        const files = form.querySelector('input[name="img"]').files
        event.preventDefault()
        console.log(title)
        if(!title) return setError(new Error('Поле "Название товара" должно быть заполнено!'))
        if(!price) return setError(new Error('Поле "Стоимость" должно быть заполнено!'))
        if(!img) return setError(new Error('Поле "Изображение" должно быть заполнено!'))                   
        const file = files[0]        
        if(file.size > 16 * 2 ** 20) return setError(new Error('Файл изображения должен быть размером не более 16 Мб'))            
        const data = { title, price, img: file }
        axios.post(
            '/newproduct', data, 
            { headers: { 'Content-Type': 'multipart/form-data'} }
        ).then(res => {
            const s = res.data.message
            alert(s)
            
            closeModal()
        })
        .catch(e => setError(e.error ? new Error(e.error) : e))        
    }

    return (
        <form className='FormProductAdd flex flex-col p-4 gap-2' onSubmit={mainAction}>
            <h2 className="mb-2">Добавить товар</h2>
            { !Auth.isGuest() ?                         
            <>                
            <input className="py-2 px-1" type="text" name="title" placeholder='Название товара'/>            
            <input className="py-2 px-1" type="number" name="price" placeholder='Цена' step="0.01"/>
            <input className="py-2 px-1" type="file" name="img" placeholder='Изображение' accept='image/webp, image/jpeg, image/png'/>
            <button className="py-1 px-2">Добавить</button>
            { error && <p className='error'>&#9888; { error.message }</p> }
            </>
            :
            <>
            <h3>Чтобы добавлять товары, необходимо сначала войти в систему (Login)</h3>
            </>
            }
        </form>
  )
}

export default ProductAdd