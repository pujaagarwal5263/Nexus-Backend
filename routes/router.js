const express = require('express');
const router = express.Router();
const controllers = require("../controllers/controller")

router.get('/', controllers.getUsers);
router.post('/send_email', controllers.sendEmail);
router.get("/read_email",controllers.readInbox);
router.post("/star_email",controllers.starEmail);
router.get("/starred_mails",controllers.getStarredMail);
router.post("/schedule_email",controllers.scheduleMail);
router.get("/scheduled_mails",controllers.getScheduledMail);

module.exports = router;