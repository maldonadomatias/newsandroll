const express = require('express');
const session = require('express-session');
const cookies = require('cookie-parser');
const { Pool } = require('pg');
const path = require('path')


const app = express();

const userLoggedMiddleware = require('./middlewares/userLoggedMiddleware');

app.use(session({
	secret: "Shhh, It's a secret",
	resave: false,
	saveUninitialized: false,
}));

app.use(cookies());

app.use(userLoggedMiddleware);

app.use(express.urlencoded({ extended: false }));

app.use(express.static('./public'));



const port_number = app.listen(process.env.PORT || 3001);

app.listen(port_number);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Template Engine
app.set('view engine', 'ejs');

// Routers
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
const newsRoutes = require('./routes/newsRoutes');

//Aquí llamo a la ruta de las api de usuarios
const apiUserRouter = require('./routes/api/user')

app.use('/', mainRoutes);
app.use('/user', userRoutes);
app.use('/news', newsRoutes);

app.use('/api/user', apiUserRouter);