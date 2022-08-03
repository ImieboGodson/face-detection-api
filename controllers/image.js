const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.API_KEY}`);

const handleApiCall = () => (req, res) => {
	const { input } = req.body;
	if(!input) {
		res.status(400).json('Input Field is Empty');
	} else {
		stub.PostModelOutputs(
			{
				// This is the model ID of a publicly available General model. You may use any other public or custom model ID.
				model_id: "a403429f2ddf4b49b307e318f00e528b",
				inputs: [{data: {image: {url: input}}}]
			},
			metadata,
			(err, response) => {
				if (err) {
					console.log("Error: " + err);
					return;
				}
		
				if (response.status.code !== 10000) {
					console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
					return;
				}
	
				res.send(response);
			}
		);
	}
}



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
    handleImageEntry,
	handleApiCall
}