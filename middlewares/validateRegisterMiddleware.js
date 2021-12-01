const path = require('path');
const { body } = require('express-validator');

module.exports = [
	body('name')
		.notEmpty().withMessage('You need to enter your full name'),
	body('email')
		.notEmpty().withMessage('You need to enter your email').bail()
		.isEmail().withMessage('Wrong email format'),
	body('password')
		.notEmpty().withMessage('You need to enter your password')
		.isLength({min: 8}).withMessage('Your password must be longer (8 characters)'),
]