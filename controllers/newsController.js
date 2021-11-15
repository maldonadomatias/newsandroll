const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


const News = db.News;
const User = db.User;

const controller = {
	list: (req, res) => {
        db.News.findAll({
            include: [{association: "users"}
            ]})
            .then(news => {
                return res.render('newsList.ejs', {news})
            })
    },
    add: function (req, res) {
        db.News.findAll({
            include: [{association: "users"}, {association: "genres"}
            ]})
            .then(news => {
                res.render('newsAdd.ejs', {news})
            })
    },
    detail: (req, res) => {
        db.News.findByPk(req.params.id, {
            include: [{association: "users"}
            ]})
            .then(news => {
                res.render('newsDetail.ejs', {news});
            });
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
        db.News.findByPk(newsID)
            .then(News => {
                return res.render('newsEdit', {News})
            });      
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
        db.News
        .findByPk(newsID)
        .then(News => {
            return res.render('newsDelete', {News})})
        .catch(error => res.send(error))
    },
    destroy: function (req, res) {
        let newsID = req.params.id;
        db.News
        .destroy({where: {id: newsID}/* , force: true */}) // force: true es para asegurar que se ejecute la acción
        .then(()=>{
            return res.redirect('/news')})
        .catch(error => res.send(error)) 
    }



}

module.exports = controller;