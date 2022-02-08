const bcryptjs = require('bcryptjs');
const {
	validationResult
} = require('express-validator');
const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");



const controller = {
	register: (req, res) => {
		let customError = "";
		return res.render('userRegisterForm', {customError});
	},
	processRegister: function (req, res){
		db.User.findOne({
			where: {email: req.body.email}
		}).then((userInDB) => {
			if (userInDB) {
				return res.render('userRegisterForm', {
					customError: {
						email: {
							msg: 'Este email ya está registrado'
						},
						
					},
					oldData: req.body
				});
			} else {
				const resultValidation = validationResult(req);

				if (resultValidation.errors.length > 0) {
					console.log(resultValidation.mapped().password);
					return res.render('userRegisterForm', {
						errors: resultValidation.mapped(),
						oldData: req.body,
						customError: {
							email: {
								msg: resultValidation.mapped().password.msg,
							}
						}
					});
				}
				else {
					db.User.create({
						name: req.body.name,
						email: req.body.email,
						password: bcryptjs.hashSync(req.body.password, 10)
					})
					.then(()=> res.redirect('/user/login'))           
					.catch(error => res.send(error))
				}
			}
		})
		
	},
	login: (req, res) => {
		let promiseGenres = db.Genre.findAll();
		let customError = "";

        Promise.all([promiseGenres])
			.then(function([genres]) {
			res.render('userLoginForm', {customError, genres:genres});
			})
			.catch(error => res.send(error));
	},
	loginProcess: (req, res) => {
				// Si no hay errores, verificamos que el email y la contraseña sean correctos
				db.User.findAll()
				.then(function (allUsers){
					let usuarioALoguearse;
					for (let i = 0; i < allUsers.length; i++){
						if (req.body.email == allUsers[i].email && bcryptjs.compareSync(req.body.password, allUsers[i].password)){
							usuarioALoguearse = allUsers[i];
							break;
						}
					}
					// Si no lo encontramos, renderizamos la vista nuevamente con los mensajes de error
					if (usuarioALoguearse == undefined){
						customError = {
							"password": {
								"value": "",
								"msg": "Las credenciales no son válidas",
								"param": "email",
								"location": "body"
							}
						}
						return res.render ("userLoginForm", {customError});
						}
					// Si lo encontramos, borro la propiedad password para guardar el usuario en session sin su contraseña, por seguridad:
					delete usuarioALoguearse.password;
					req.session.userLogged = usuarioALoguearse;
					// Si el usuario marcó "mantenerme conectado", guardamos las cookies por un año
					if (req.body.rememberUser) {
						console.log("Se guarda la cookie")
						res.cookie('email', req.body.email, {maxAge: 1000*60*60*24*365})
					}
					res.redirect ('/news');  
				})
			//}
		},
	profile: (req, res) => {
			db.News.findAll({
				include: [{association: "users"}, {association: "genres"}
				]})
				.then((news) => {
					return res.render('userProfile', {
						user: req.session.userLogged,
						news
					})
				})

		
	},

	logout: (req, res) => {
		res.clearCookie('userEmail');
		req.session.destroy();
		return res.redirect('/');
	}
}

module.exports = controller;