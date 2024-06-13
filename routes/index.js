var express = require('express');
var router = express.Router();
const postController = require('../controllers/postController');


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// Get all POSTS
router.get('/', postController.postList);


module.exports = router;
