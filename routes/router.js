const express = require('express');
const router = express.Router();
const controllers = require("../controllers/controller")

router.get('/', controllers.getUsers);
router.post('/send_email', controllers.sendEmail);
router.get("/read_email",controllers.readInbox);

module.exports = router;