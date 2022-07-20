const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();

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

const PORT = 8000;

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());


//HOME ROUTE
app.get('/', (req, res) => {
	knex.select('*')
		.from('users')
		.then(users => {
			res.send(users);
		})
		.catch(err => {
			res.status(400).json('Error Fetching Users');
		})
})

//USER SIGN IN ROUTE
app.post('/login', (req, res) => {
	const { email, password } = req.body;
	
	knex.select('email', 'hash')
		.from('login')
		.where('email', '=', email)
		.returning('*')
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if(isValid) {
				return knex.select('*')
					.from('users')
					.where('email', '=', data[0].email)
					.returning('*')
					.then(user => {
						res.send(user[0]);
					})
					.catch(err => {
						res.status(400).json('Error fetching user data');
					})
			} else {
				res.status(400).json('Invalid Credentials');
			}
		})
		.catch(err => {
			res.status(400).json('Error Logging In');
		})
})

//REGISTER USER ROUTE
app.post('/register', (req, res) => {
	const { name, email, password } = req.body;
	const saltRounds = 10;
	const hash = bcrypt.hashSync(password, saltRounds);
	
	knex.transaction(trx => {
		trx('login')
			.insert({
				email: email,
				hash: hash
			})
			.returning('email')
			.then(loginEmail => {
				return trx.insert({
						email: loginEmail[0].email,
						name: name,
						joined: new Date()
					})
					.into('users')
					.returning('*')
					.then(user => {
						if(user.length) {
							res.send(user[0]);
						} else {
							res.status(400).json('Error Fetching User');
						}
					})
					.catch(err => {
						res.status(400).json('Error Registering User');
					})
			})
			.then(trx.commit)
			.then(trx.rollback)
			.catch(err => {
				res.status(400).json('Error Registering User');
			})
	})
	.catch(err => {
		res.status(400).json('Unable to register');
	})
})


//UPDATE USER ENTRIES
app.put('/image', (req, res) => {
	const { id } = req.body;
	
	knex.select('*')
		.from('users')
		.where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			if(entries.length) {
				res.send(entries[0].entries);
			} else {
				res.status(400).json('Error Updating User Entries');
			}
		})
		.catch(err => {
			res.status(400).json('Error Updating User Entries');
		})
})


app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let foundUser = false;

	db.users.map((user) => {
		if(user.id === id) {
			foundUser = true;
			res.send(user);
		}
	})

	if(!foundUser) {
		res.status(400).json('user not found!');
	}
})



app.listen(PORT, () => {
	console.log(`Server is live on PORT ${PORT}!!`);
});