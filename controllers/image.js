const handleImageEntry = (knex) => (req, res) => {
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
}

module.exports = {
    handleImageEntry
}