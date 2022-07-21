const handleGetUsers = (knex) => (req, res) => {
	knex.select('*')
		.from('users')
		.then(users => {
			res.send(users);
		})
		.catch(err => {
			res.status(400).json('Error Fetching Users');
		})
}

module.exports = {
    handleGetUsers
}