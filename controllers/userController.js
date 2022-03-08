const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const db = require("../database/models");

const Genre = db.Genre;

const controller = {
  register: (req, res) => {
    let promiseGenres = db.Genre.findAll();
    let customError = "";

    Promise.all([promiseGenres])
      .then(function ([genres]) {
        res.render("userRegisterForm", { customError, genres: genres });
      })
      .catch((error) => res.send(error));
  },
  processRegister: function (req, res) {
    db.User.findOne({
      where: { email: req.body.email },
    }).then((userInDB) => {
      if (userInDB) {
        let promiseGenres = db.Genre.findAll();
        let customError = {
          email: {
            msg: "Este email ya está registrado",
          },
        };

        Promise.all([promiseGenres])
          .then(function ([genres]) {
            res.render("userRegisterForm", {
              customError,
              genres: genres,
              oldData: req.body,
            });
          })
          .catch((error) => res.send(error));
      } else {
        const resultValidation = validationResult(req);

        if (resultValidation.errors.length > 0) {
          let promiseGenres = db.Genre.findAll();
          let customError = {
            email: {
              msg: resultValidation.mapped().password.msg,
            },
          };

          Promise.all([promiseGenres])
            .then(function ([genres]) {
              res.render("userRegisterForm", {
                customError,
                genres: genres,
                oldData: req.body,
                errors: resultValidation.mapped(),
              });
            })
            .catch((error) => res.send(error));
        } else {
          db.User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcryptjs.hashSync(req.body.password, 10),
          })
            .then(() => res.redirect("/user/login"))
            .catch((error) => res.send(error));
        }
      }
    });
  },
  login: (req, res) => {
    let promiseGenres = db.Genre.findAll();
    let customError = "";

    Promise.all([promiseGenres])
      .then(function ([genres]) {
        res.render("userLoginForm", { customError, genres: genres });
      })
      .catch((error) => res.send(error));
  },
  loginProcess: (req, res) => {
    // Si no hay errores, verificamos que el email y la contraseña sean correctos
    db.User.findAll().then(function (allUsers) {
      let usuarioALoguearse;
      for (let i = 0; i < allUsers.length; i++) {
        if (
          req.body.email == allUsers[i].email &&
          bcryptjs.compareSync(req.body.password, allUsers[i].password)
        ) {
          usuarioALoguearse = allUsers[i];
          break;
        }
      }
      // Si no lo encontramos, renderizamos la vista nuevamente con los mensajes de error
      if (usuarioALoguearse == undefined) {
        customError = {
          password: {
            value: "",
            msg: "Las credenciales no son válidas",
            param: "email",
            location: "body",
          },
        };
        let promiseGenres = db.Genre.findAll();

        Promise.all([promiseGenres])
          .then(function ([genres]) {
            res.render("userRegisterForm", { customError, genres: genres });
          })
          .catch((error) => res.send(error));
      }
      // Si lo encontramos, borro la propiedad password para guardar el usuario en session sin su contraseña, por seguridad:
      delete usuarioALoguearse.password;
      req.session.userLogged = usuarioALoguearse;
      // Si el usuario marcó "mantenerme conectado", guardamos las cookies por un año
      if (req.body.rememberUser) {
        console.log("Se guarda la cookie");
        res.cookie("email", req.body.email, {
          maxAge: 1000 * 60 * 60 * 24 * 365,
        });
      }
      res.redirect("/news");
    });
    //}
  },
  profile: (req, res) => {
    let promiseNews = db.News.findAll({
      include: [{ association: "users" }, { association: "genres" }],
    });
    let promiseGenre = Genre.findAll();

    Promise.all([promiseNews, promiseGenre])
      .then(function ([news, genres, user]) {
        res.render("userProfile", { news: news, genres: genres, user: req.session.userLogged, });
      })
      .catch((error) => res.send(error));
  },

  logout: (req, res) => {
    res.clearCookie("userEmail");
    req.session.destroy();
    return res.redirect("/");
  },
};

module.exports = controller;
