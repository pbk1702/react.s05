import './Payment.css'
import React from 'react'

const Payment = ( { closeModal } ) => {    

    const [errors, setErrors] = React.useState([])
    const [cardNumber, setCardNumber] = React.useState('')
    const [cardExpiry, setCardExpiry] = React.useState('')
    const [cardCVC, setCardCVC] = React.useState('')

    const mainAction = (event) => {        
        event.preventDefault()
        validateInput()
    }

    const handleCardNumberChange = (e) => {
        const setState = setCardNumber
        const cv = cardNumber
        let v = e.target.value
        if(v === cv) return 
        // если новое значение пустое, устанавливаем его и выходим
        if(v.length === 0) {
            setState('')
            return
        }
        let a = v.match(/[0-9]{1}/g)
        // если цифр не найдено в новом значении, устанавливаем пустое, и выходим
        if(!a) {
            setState('')
            return
        }
        v = a.join('')
        // проверяем количество цифр в номере карты. Должно быть не больше 19
        if(!v || !v.match(/^[0-9]{0,19}$/)) {
            setState(cv)
            return
        }
        else {
            // форматируем номер карты добавляя пробелы
            a = (v.match(/[0-9]{1,4}/g))
            v = a.join('-')
            setState(v)
        }            
    }

    const handleCardExpiryChange = (e) => {
        const setState = setCardExpiry
        const cv = cardExpiry      
        let v = e.target.value
        if(v === cv) return
        v = v.replace(' ', '')
        v = v.replace('/', '')
        let mm = v.substring(0, 2)
        let yy = v.substring(2, 5)
        const re = /^[0-9]{0,4}$/
        if(!v.match(re))
            setState(cv)            
        else {
            if(v.length >= 3) v = "".concat(mm, "/", yy)
            setState(v)
        }
            
    }

    const handleCardCVCChange = (e) => {
        const setState = setCardCVC
        const cv = cardCVC
        let v = e.target.value
        if(v === cv) return
        v = v.trim()
        v = v.substring(0,3)
        console.log(v)
        const re = /^[0-9]{0,3}$/
        const nv = v.match(re) ? v : cv
        setState(nv)
    }

    const validateInput = (e) => {
        const form = document.querySelector("form.formPayment")
        const cardNumber = form.querySelector(`input[name="cardNumber"]`)
        const cardExpiry = form.querySelector(`input[name="cardExpiry"]`)
        const cardCVC = form.querySelector(`input[name="cardCVC"]`)
        
        const ne = []
        let v = cardNumber.value
        if(v.length === 0) 
            ne.push(new Error('Номер карты должен быть заполнен!'))
        else {
            v = v.match(/[0-9]{1}/g)            
            if(!v)
                ne.push(new Error('Номер карты должен быть заполнен!'))
            else {
                v = v.join('')
                if(v.length < 16 || v.length > 19)
                    ne.push(new Error(`Номер карты "Мир" должен состоять из 16-19 цифр`))
            }
        }
        if(!cardExpiry.value.match(/^[0-1]{1}[0-9]{1}[/]{1}[0-9]{2}$/)) 
            ne.push(new Error('Поле даты действия карты должно быть заполнено в формате ММ/ГГ'))
        else {
            const mm = Number(cardExpiry.value.substring(0,2))
            const yy = Number(cardExpiry.value.substring(3,5))
            if(mm < 1 || mm > 12) 
                ne.push(new Error('Неправильно указан месяц в дате действия карты. Должен быть в диапазоне от 01 до 12'))
            if(yy < 0 || yy > 99)
                ne.push(new Error('Неправильно указан год в дате действия карты. Должен быть в диапазоне от 00 до 99'))
        }

        if(!cardCVC.value.match(/^[0-9]{3}$/)) 
            ne.push(new Error('Значение в поле CVC должно состоять из трех цифр, то есть находиться в диапазоне от 000 до 999'))

        if(ne.length === 0) alert("Ура! Ошибок в форме не обнаружено! Оплата была бы совершена!")
        setErrors(ne)
    }

    return (
        <form className='formPayment p-4 flex flex-col gap-2' onSubmit={ mainAction }>
            <h2>Оплата картой</h2>
            <label htmlFor="cardNumber">
                <div>Номер карты</div>
                <input type="tel" name="cardNumber" value={cardNumber} placeholder="Номер карты" required onChange ={ handleCardNumberChange }/>
            </label>            
            <label htmlFor="cardExpiry">
                <div>Месяц / Год</div>
                <input type="tel" name="cardExpiry" value={cardExpiry} placeholder="ММ/ГГ" required onChange ={ handleCardExpiryChange }/>                
            </label>
            <label htmlFor="cardCVC">
                <div>CVC / CVV</div>
                {/* текст ввода в поле специально оставляю видимым, для целей отладки. В продакшн поставил бы type=password */}
                <input type="tel" name="cardCVC" value={cardCVC} placeholder="CVC / CVV" required onChange ={ handleCardCVCChange } />                
            </label>
            <button>Оплатить</button>
            { 
                (errors.length > 0) && errors.map( error => ( <p key={ errors.indexOf(error) } className='error'>&#9888; { error.message }</p> ))
            }
        </form>
  )
}

export default Payment

