const express = require('express')
const router = express.Router()

const postController = require('../controllers/postController');
const likesController = require('../controllers/likesController');
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.get('/', postController.index);

router.post('/', postController.create);

router.put('/:id', postController.update);

router.post('/:id/comment', commentController.create);

router.put('/:id/comment/:commentId', commentController.update);

router.delete('/:id/comment/:commentId', commentController.delete);

router.post('/:id/like', likesController.like);

router.post('/:id/unlike', likesController.unlike);

router.delete('/:id', postController.delete);

module.exports = router;