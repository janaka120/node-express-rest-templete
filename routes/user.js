const express = require('express');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');
const {body} = require('express-validator');

const router = express.Router();

router.get('/status', isAuth, userController.getStatus);

router.put('/status', isAuth, [
    body('status').trim().not().isEmpty()
] ,userController.postStatus);


module.exports = router;