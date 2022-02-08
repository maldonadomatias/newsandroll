const db = require('../database/models');


const Genre = db.Genre;

const controller = {
	index: (req, res) => {
		let promiseGenres = Genre.findAll();

        Promise.all([promiseGenres])
			.then(function([genres]) {
			res.render('index', {genres:genres});
			})
			.catch(error => res.send(error));
	}

}

module.exports = controller;