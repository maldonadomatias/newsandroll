const express = require('express');
const session = require('cookie-session');
const cookies = require('cookie-parser');

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

const port_number = app.listen(process.env.PORT || 3000);
app.listen(port_number);

// Template Engine
app.set('view engine', 'ejs');

// Routers
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
const newsRoutes = require('./routes/newsRoutes');

app.use('/', mainRoutes);
app.use('/user', userRoutes);
app.use('/news', newsRoutes);