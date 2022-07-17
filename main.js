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

const db = {
	users: [
		{
			id: "1",
			name: 'Jefferson Grey',
			email: 'jeff@sample.com',
			password: 'beans',
			entries: 5,
			followers: [ 002, 003 ],
			joined: new Date(),
		},
		{
			id: '2',
			name: 'Adewale James',
			email: 'adewale@sample.com',
			password: 'rice',
			entries: 3,
			followers: [ 001 ],
			joined: new Date(),
		},
		{
			id: '3',
			name: 'Kaleb Jones',
			email: 'jones@sample.com',
			password: 'cats',
			entries: 3,
			followers: [ 001, 002 ],
			joined: new Date(),
		},
	]
}

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
app.post('/signin', (req, res) => {
	const { email, password } = req.body;
	let foundUser = false;

	db.users.map((user) => {
		if(user.email === email && user.password === password) {
			foundUser = true;
			res.status(200).json(user);
		}
	})

	if(!foundUser) {
		res.status(400).json('User not found!');
	}
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
						res.send(user[0]);
					})
			})
			.then(trx.commit)
			.then(trx.rollback)
	})
	.catch(err => {
		res.status(400).json('Unable to register');
	})
})


//UPDATE USER ENTRIES
app.put('/entries', (req, res) => {
	const { id } = req.body;
	let foundUser = false;

	db.users.map((user) => {
		if(user.id === id) {
			foundUser = true;
			user.entries += 1;
			res.send(user);
		}
	})

	if(!foundUser) {
		res.status(404).json('Unauthorized Update!');
	}
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