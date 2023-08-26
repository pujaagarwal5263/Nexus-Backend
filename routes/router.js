const express = require('express');
const router = express.Router();
const controllers = require("../controllers/controller")

router.get('/', controllers.getUsers);
router.post('/send_email', controllers.sendEmail);

module.exports = router;