const express = require('express');
const cors = require('cors');

const app = express();

const PORT = 3001;

const db = {
	users: [
		{
			id: 001,
			name: 'Jefferson Grey',
			email: 'jeff@sample.com',
			password: 'beans',
			entries: 5,
			followers: [ 002, 003 ],
			joined: new Date(),
		},
		{
			id: 002,
			name: 'Adewale James',
			email: 'adewale@sample.com',
			password: 'rice',
			entries: 3,
			followers: [ 001 ],
			joined: new Date(),
		},
		{
			id: 003,
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
	res.send(db.users);
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
	let userExist = false;
	let newUser;

	db.users.map((user) => {
		if(user.email === email) {
			userExist = true;
			res.status(404).json('User already exists!')
		}
	})

	if(!userExist) {
		newUser = {
			id: db.users.length + 1,
			name: name,
			email: email,
			password: password,
			entries: 0,
			followers: [],
			joined: new Date(),
		}

		db.users.push(newUser);
		
		res.send(newUser)
	}
})

//UPDATE USER DETAILS



app.listen(PORT, () => {
	console.log(`Server is live on PORT ${PORT}!!`);
});