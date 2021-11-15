const bcryptjs = require('bcryptjs');
const {
	validationResult
} = require('express-validator');
const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");

const User = require('../database/models/User');

const controller = {
	register: (req, res) => {
		return res.render('userRegisterForm');
	},
	processRegister: function (req, res){
		db.User.create({
            name: req.body.name,
			email: req.body.email,
			password: bcryptjs.hashSync(req.body.password, 10)
        })
        .then(()=> res.redirect('/user/login'))            
        .catch(error => res.send(error))
	},
	login: (req, res) => {
		return res.render('userLoginForm');
	},
	loginProcess: (req, res) => {
			// Verifica que los campos se hayan llenado correctamente
			// let errors = validationResult(req);
			// // Si hay errores, renderizamos la vista nuevamente con los mensajes de error
			// if (!errors.isEmpty()) {
			// 	let cssSheets = ["login"];
			// 	let title = "Inicio de sesión";
			// 	return res.render ("users/login.ejs", {cssSheets, title, errorMessages: errors.mapped()});
			// } else {
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
						let customError= {
							"password": {
								"value": "",
								"msg": "Las credenciales no son válidas",
								"param": "email",
								"location": "body"
							}
						}
						let title = "Inicio de sesión"; 
						return res.render ("user/login", {title});
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
		return res.render('userProfile', {
			user: req.session.userLogged
		});
	},

	logout: (req, res) => {
		res.clearCookie('userEmail');
		req.session.destroy();
		return res.redirect('/');
	}
}

module.exports = controller;