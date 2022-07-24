const handleGetUserProfile = (knex) => (req, res) => {
	const { id } = req.params;
	
	knex.select('*')
		.from('users')
		.where('id', '=', id)
		.returning('*')
		.then(user => {
			if(user.length) {
				res.send(user[0]);
			} else {
				res.status(400).json('Error fetching user data');
			}
		})
		.catch(err => {
			res.status(400).json('User Not Found');
		})
}


const handleGetAllUsersProfile = (knex) => (req, res) => {
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
    handleGetUserProfile,
	handleGetAllUsersProfile
}