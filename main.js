const express = require("express");
const app = express();

app.get('/', (req, res) => {
	res.send('Hello World, I am alive!');
})

app.listen(3000, () => {
	console.log('Server is live!!');
});