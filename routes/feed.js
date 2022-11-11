const express = require('express');
const {body} = require('express-validator/check');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/posts', isAuth, feedController.getPosts);


// add middleware to validate request body
router.post('/post', [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
],isAuth, feedController.createPost);

router.get('/post/:postId', isAuth, feedController.getPostDetails);

router.put('/post/:postId', [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
],feedController.updatePostDetails);

router.delete('/post/:postId', isAuth, feedController.deletePost)

module.exports = router;