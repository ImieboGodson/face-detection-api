const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const register = require('./controllers/register');
const login = require('./controllers/login');
const image = require('./controllers/image');
const profile = require('./controllers/profile');

const { POSTGRES_DB_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env;

const knex = require('knex')({
	client: 'pg',
	connection: {
		host : '127.0.0.1',
		port : POSTGRES_DB_PORT,
		user : POSTGRES_USER,
		password : POSTGRES_PASSWORD,
		database : POSTGRES_DB
	}
});

const app = express();

const PORT = process.env.PORT || 3005;

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());


app.get('/', profile.handleGetAllUsersProfile(knex));
app.post('/login', login.handleUserLogin(knex, bcrypt));
app.post('/register', register.handleRegisterUser(knex, bcrypt));
app.get('/profile/:id', profile.handleGetUserProfile(knex));
app.put('/image', image.handleImageEntry(knex));
app.post('/image_data', image.handleApiCall());



app.listen(PORT, () => {
	console.log(`Server is live on PORT ${PORT}!!`);
});