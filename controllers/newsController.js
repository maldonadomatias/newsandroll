const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


const News = db.News;
const User = db.User;
const Genre = db.Genre;

const controller = {
	list: (req, res) => {
        let promiseNews = db.News.findAll({
            include: [{association: "users"}, {association: "genres"}
            ], order: [
                ['id', 'DESC']
        ]});
        let promiseGenres = Genre.findAll();

        Promise.all([promiseNews, promiseGenres])
			.then(function([news, genres]) {
			res.render('newsList', {news:news, genres:genres});
			})
			.catch(error => res.send(error));
    },
    add: (req, res) => {
        let promiseNews = News.findAll({
            include: [{association: "users"}, {association: "genres"}
            ]});
		let promiseGenre = Genre.findAll();

		Promise.all([promiseNews, promiseGenre])
			.then(function([news, genres]) {
                res.render('newsAdd.ejs', {news:news, genres:genres});
			})
			.catch(error => res.send(error));
    },
    detail: (req, res) => {
        let promiseNews = db.News.findByPk(req.params.id, {
            include: [{association: "users"}, {association: "genres"}
            ]})
        
        let promiseGenre = Genre.findAll();

		Promise.all([promiseNews, promiseGenre])
			.then(function([news, genres]) {
                res.render('newsDetail.ejs', {news:news, genres:genres});
			})
			.catch(error => res.send(error));
    },
    create: function (req, res) {
        db.News.create({
            title: req.body.title,
            description: req.body.description,
            user_id: req.body.user_id,
            genre_id: req.body.genre_id
        })
        .then(()=> res.redirect('/news'))            
        .catch(error => res.send(error))
    },
    edit: function(req, res) {
        let newsID = req.params.id;
        let promiseNews = db.News.findByPk(newsID)
        let promiseGenre = Genre.findAll();

        Promise.all([promiseNews, promiseGenre])
            .then(function([news, genres]) {
                res.render('newsEdit', {news:news, genres:genres});
            })
            .catch(error => res.send(error));
    },
    update: function(req,res) {
        let newsID = req.params.id;
        db.News.update({
            title: req.body.title,
            description: req.body.description,
            genre_id: req.body.genre_id,
        },
        {
            where: {id: newsID}
        })
        .then(()=> res.redirect('/news'))
        .catch(error => res.send(error)) 
    },
    delete: function (req, res) {
        let newsID = req.params.id;
        let promiseNews = db.News.findByPk(newsID)
        let promiseGenre = Genre.findAll();

        Promise.all([promiseNews, promiseGenre])
            .then(function([News, genres]) {
                res.render('newsDelete', {News:News, genres:genres});
            })
            .catch(error => res.send(error));
    },
    destroy: function (req, res) {
        let newsID = req.params.id;
        db.News
        .destroy({where: {id: newsID}/* , force: true */}) // force: true es para asegurar que se ejecute la acción
        .then(()=>{
            return res.redirect('/news')})
        .catch(error => res.send(error)) 
    },
    search: (req, res) => {
        let search = req.query.search
        let promiseNews = db.News.findAll({
            where: {title: {[Op.like]: `%${req.query.search}%`}},
            include: [{association: "users"}, {association: "genres"}
            ], order: [
                ['id', 'DESC']
        ]
        })
        let promiseGenre = Genre.findAll();

		Promise.all([promiseNews, promiseGenre])
			.then(function([news, genres, search]) {
                res.render('userResults.ejs', {news:news, genres:genres, search});
			})
			.catch(error => res.send(error));

    },
    categories: (req,res) => {
    let promiseNewsCategories = db.News.findAll({
        where: {genre_id: req.params.id},
        include: [{association: "users"}, {association: "genres"}
        ]
    });
    let promiseGenresCategories = db.Genre.findAll();

    
    
    Promise.all([promiseNewsCategories, promiseGenresCategories])
    .then(function([news, genres]) {
        res.render('newsCategories', {news:news, genres:genres});
        })
        .catch(error => res.send(error));

	}



}

module.exports = controller;