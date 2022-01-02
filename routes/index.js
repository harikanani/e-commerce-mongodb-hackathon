const express = require('express');
const router = express.Router();
const AuthController = require("../controllers/AuthController")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send({ message: "hello folks"})
  // res.render('index', { title: 'Express' });
});

router.post("/register", AuthController.register);

module.exports = router;
