const express = require('express');
const router = express.Router();
const moviesAPIController = require('../../controllers/api/mainApiController');

//Rutas
//Listado de usuarios

router.get('/', moviesAPIController.list);

module.exports = router;