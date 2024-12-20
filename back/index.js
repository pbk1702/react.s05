// конфигурация
const config = { 
    jwt: { 
        secret: 'the-secret-key',
        expiresIn: '3d',
    },
    db: {
        host: '127.0.0.1',
        port: 27017,
        db: 'test',
    },
    express: {
        port: 9001,
    },    
}
// конец конфигурации

// mongoose
import mongoose from 'mongoose'
// my mongoose models
import User from './models/User.js'
import Product from './models/Product.js'
import Cart from './models/Cart.js'
// jwt
import jwt from 'jsonwebtoken'
// express server
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import * as fs from 'fs'

// инициализация web сервера express
const app = express()

const upload = multer({ dest: './upload' })

// переопределение метода json в объекте res
// объединяет накопленные данные при отправке результата клиенту методом json
true && (function() {
    const _json = app.response.json    
    app.response.json = function(body = undefined) {                            
        const res = this
        const data = res.data
        // если данные есть, объединяем в одно    
        if (data) body = body ? { ...body, ...data } : data
        return _json.apply( this, [body] )        
    }    
})() 

// типы файлов изображений
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
}

app.use(cors())
app.use('/img', express.static('img'))
// middleware: автоматически декодирование json запросов
app.use(express.json())
// middleware: авторизация пользователей для всех запросов
app.use(async (req, res, next) => {            
    // удаляем любые данные об авторизации пользователя
    delete req.auth    
    // проверяем авторизацию пользователя по jwt токену из заголовка запроса
    let s = req.headers.authorization 
    const ss = 'Bearer '
    // const regex = /^Bearer (.+)$/;
    // const token = regex.exec(s)[1];
    const token = (s && (s = s.trim()) && s.startsWith(ss)) ? (s.substring(ss.length, s.length)).trim() : undefined            
    // проверка jwt токена // 
    if(token) {
        jwt.verify(token, config.jwt.secret, async (e, payload) => {
            // если токен расшифрован без ошибки и есть полезная нагрузка, тогда устанавливаем данные авторизации в объект запроса
            if(!e && payload) {
                const user = await User.findById(payload.id)
                if(user) {                        
                    req.auth = { 
                        user: user,                            
                    }
                    if(!res.data) res.data = { }                        
                    res.data.auth = {
                        user: { 
                            login: user.login, 
                        }
                    }                                                                                                                  
                    console.log(`Авторизован по токену: ${req.auth.user.login} `)
                }
            }
            next() // только когда проверка завершена, передаем управление следующему обработчику
        })
    } else next() // если токена клиентом передано не было, сразу передаем управление следующему обработчику 
}) 

// изменение пароля
app.post('/changePassword', async (req, res) => {
    console.log(`POST/changePassword: ${JSON.stringify(req.body)}`)
    // изменить пароль можно только если пользователь залогинен
    const user = req.auth?.user
    if(!user) return res.status(404).json({ error: 'Страница изменения пароля не найдена'})
    const { password, newPassword } = req.body    
    if(!newPassword) return res.status(400).json({ error: 'Новый пароль не должен быть пустым'})
    const u = await User.findOneAndUpdate({ _id: user._id, password: password}, { password: newPassword })
    console.log(`Пользователь с указанным логином и паролем не был найден`)
    if(!u) return res.status(400).json({ error: 'Неверный пользователь или пароль' })
    console.log(`Пароль пользователя ${user.login} успешно изменен. Старый пароль: ${password} Новый пароль: ${newPassword}`)
    // удаляем данные авторизации, чтобы пользователь мог войти в системы с новым паролем
    delete res.data.auth
    res.status(200).json({message: 'Пароль успешно изменен. Перезайдите в систему с новым паролем'})
})

// регистрация
app.post('/register', async (req, res) => {
    console.log(req.body)    
    // регистрация возможна только если пользователь вышел из системы
    if(req.auth) return res.status(400).json({ error: 'Чтобы зарегистировать нового пользователя, необходимо сначала выйти из системы'})
    // процедура создания нового пользователя
    const { login, password, email } = req.body
    if(!login || !password || !email) return res.status(400).json({ error: 'Поля: логин, пароль, эл. почта не должны быть пустыми'})
    const u = new User({login, password, email})
    const data = {}
    try {
      await u.save()            
      return res.status(201).json( {message: 'Новый пользователь успешно зарегистрирован.' }) // 201 - новый ресурс был создан
    }        
    catch (e) { 
        console.log(e)
        return res.status(400).json({ error: e.message })        
    }
})

// логин
app.post('/login', async (req, res) => {
    if(req.auth) return res.status(400).json({ error: 'Вы уже в системе'} )    
    const {login, password} = req.body
    const user = await User.findOne( {login} )
    if (!user) return res.status(400).json({error: 'Пользователь с таким логином и паролем не найден'})
    if (user.password != password) return res.status(400).json({error: 'Неверный логин/пароль'})
    // полезная нагрузка
    const payload = { 
        id: user._id, 
    }
    // создаем jwt токен
    const token = jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn })    
    delete res['data']        
    res.status(200).json({ auth: { token: token, login: user.login }, message: 'Успешный вход в систему' })
    console.log(`Пользователь ${user.login} вошел в систему (login).`)
})

app.get('/user', async (req, res) => {
    const user = req.auth?.user    
    if(!user) return res.status(400).json({ error: 'Invalid user'})    
    const u = await User.findById(user._id)
    const data = { user: { id: u.id, login: u.login, email: u.email } }
    return res.status(200).json(data)
})

// список продуктов
app.get('/products', async (req, res) => {        
    const products = await Product.find()
    res.status(200).json( { products } )
})

// список продуктов с данными
app.post('/products', async (req, res) => {        
    const ids = req.body    
    // если список id передан, выполняем запрос
    if(ids.length > 0 ) {
        res.status(200).json( { products: await Product.find({ '_id': { $in: ids} }) })
    }
    else 
        res.status(200).json( { products: [] } )    
})

// добавление товара
app.post('/newproduct', upload.single('img'), async (req, res) => {
    console.log(`newproduct post request`)
    // file
    const { file } = req    
    if(!file) return res.status(400).json({ error: 'Файл с изображением товара не был загружен'})    
    const ext = MIME_TYPES[file.mimetype]
    if(!ext) return res.status(400).json({ error: 'Недопустимый тип файла. Должен быть: jpeg, jpg, png, webp'})    
    // title, price
    const { title } = req.body
    if(!title || title.length < 3) return res.status(400).json({ error: 'Наименование товара должно быть заполнено и иметь размер не менее 3-х знаков'})        
    let { price } = req.body
    price = parseFloat(price)
    price = (typeof(price) === 'number') && (price > 0) && price.toFixed(2)
    if(!price) return res.status(400).json({ error: 'Цена товара должна быть представлена положительным числом'})                    
    const p = new Product({ title, price })        
    p.img = "img/".concat(p._id, ".", ext)
    fs.renameSync(file.path, p.img)
    if(fs.existsSync(p.img)) { 
        await p.save()    
        res.status(201).json( { message: 'Товар успешно добавлен' })
    }
})


// процедура main
const main = async () => {
    // database connection    
    const db_uri = `mongodb://${config.db.host}:${config.db.port}/${config.db.db}`    
    let db_isConnected = false        
    // цикл подключения к базе данных mongoose
    while(!db_isConnected) {
        try {
            console.log(`Подключение к базе данных \'${db_uri}\'`)
            await mongoose.connect(db_uri, {})
            db_isConnected = true
            console.log(`Подключение к базе данных выполнено успешно`)
        } catch (e) {
            console.log(e)
            console.log('Ошибка подключения к базе данных')        
            }
    }
    // express server
    console.log('Запуск сервера express...')
    try {
        app.listen(config.express.port, () => {
            console.log(`Сервер успешно запущен. Порт: ${config.express.port}`)
        })        
    } catch (e) {
        console.log(e)
    }
}

// стартуем
main()
