const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
const connectDB = require('./config/db');
const app = express()
const PORT = process.env.PORT || 3000;

// Init Middleware
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// Connect Database
connectDB()

app.get('/', (req, res) => res.send('Hello!'))
app.use('/auth', require('./routes/api/auth'))
app.use('/category', require('./routes/api/category'))
app.use('/product', require('./routes/api/product'))
app.use('/user', require('./routes/api/user'))

app.listen(PORT, () => { console.log(`port ${PORT}`) })