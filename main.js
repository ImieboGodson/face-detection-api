const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const register = require('./controllers/register');
const login = require('./controllers/login');
const image = require('./controllers/image');
const profile = require('./controllers/profile');


const knex = require('knex')({
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: {
			rejectUnauthorized: false
		}
	}
});

const app = express();

const PORT = process.env.PORT || 3005;

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());


// app.get('/', profile.handleGetAllUsersProfile(knex));
app.get('/', profile.handleGetAllUsersProfile(knex));
app.post('/login', login.handleUserLogin(knex, bcrypt));
app.post('/register', register.handleRegisterUser(knex, bcrypt));
app.get('/profile/:id', profile.handleGetUserProfile(knex));
app.put('/image', image.handleImageEntry(knex));
app.post('/image_data', image.handleApiCall());



app.listen(PORT, () => {
	console.log(`Server is live on PORT ${PORT}!!`);
});