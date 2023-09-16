const express = require('express')
const router = express.Router()

const postController = require('../controllers/postController');
const likesController = require('../controllers/likesController');
const auth = require('../middleware/auth');

router.get('/', postController.index);

router.post('/', postController.create);

router.put('/:id', postController.update);

router.post('/:id/like', likesController.like);

router.post('/:id/unlike', likesController.unlike);

router.delete('/:id', postController.delete);

module.exports = router;