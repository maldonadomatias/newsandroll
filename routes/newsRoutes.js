const express = require('express');
const router = express.Router();

const newsController = require('../controllers/newsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', newsController.list);
router.get('/add', authMiddleware, newsController.add);
router.post('/create', authMiddleware, newsController.create)
router.get('/detail/:id', newsController.detail);
router.get('/edit/:id', newsController.edit);
router.post('/update/:id', newsController.update);

router.get('/delete/:id', newsController.delete);
router.post('/delete/:id', newsController.destroy);

module.exports = router;