const bcryptjs = require('bcryptjs');
const {
	validationResult
} = require('express-validator');
const path = require('path');
const db = require('../../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");

const User = require('../../database/models/User');

const controller = {
    'list': (req, res) => {
        db.User.findAll({
            include: ['news']
        })
        .then(user => {
            let respuesta = {
                meta: {
                    status : 200,
                    total: user.length,
                    url: 'api/user'
                },
                data: user
            }
                res.json(respuesta);
            })
}
}

module.exports = controller;