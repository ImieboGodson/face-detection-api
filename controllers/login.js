const handleUserLogin = (knex, bcrypt) => (req, res) => {
	const { email, password } = req.body;
	
	if(email === '' || password === '') {
		res.status(400).json("You Can't Leave Input Fields Empty");
	} else {
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
	}
	
}

module.exports = {
    handleUserLogin
}