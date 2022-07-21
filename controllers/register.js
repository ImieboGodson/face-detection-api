const handleRegisterUser = (knex, bcrypt) => (req, res) => {
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
}

module.exports = {
    handleRegisterUser
}