require('dotenv').config() //for env file to load up

const express = require('express')
const mongoose = require('mongoose')

const app = express();

//Import routes
const authRoute = require('./routes/auth')
const postRoute = require('./routes/private')

mongoose.connect('mongodb://localhost:27017/auth', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Connected to database...')
    }).catch(err => {
        console.log(err)
    })

// Middlewares
app.use(express.json()) //replacing bodyParser

//routes midddlewares
app.use('/api/user', authRoute) //url example = api/user/register
app.use('/api/posts', postRoute)
let port = 8080 || process.env.PORT;

app.listen(port, () => console.log(`Server running on port ${port}....`));