let token;
const {NylasCongif} =require("../nylas-config");
const { default: Draft } = require('nylas/lib/models/draft');
const User = require("../modules/userSchema");
const cron = require('node-cron');

const labelMap = {
  "Inbox": "inbox",
  "Sent Mail":"sent",
  "Trash":"trash",
  "Category Social":"social",
  "Category Updates":"updates",
  "Important":"important",
  "Category Personal":"personal",
  "Spam":"spam",
  "All Mail":"all",
  "Category Promotions":"promotions"
}

const getLabelForKey = value => {
  for (const key in labelMap) {
    if (labelMap.hasOwnProperty(key) && labelMap[key] === value) {
      return key;
    }
  }
  return value; 
};

const getUsers = (req, res) => {
  res.send("User list");
};

const sendEmail = async(req, res) => {
  try{
    const {subject, body, recipient_array } = req.body;
    token = "t4qLPsX1c2KMCXpGMP3Qe6BVce0xBx";
    const nylas = NylasCongif.with(token);
    
    const draft = new Draft(nylas, {
      subject: subject,
      body: body,
      to: recipient_array
    });
    await draft.send();
  
    return res.status(200).send("mail sent successfully");
  }catch(err){
    console.log(err);
    return res.status(500).send("could not send email")
  }
};

const readInbox = async(req,res) => {
  try{
    token = "t4qLPsX1c2KMCXpGMP3Qe6BVce0xBx";
    const nylas = NylasCongif.with(token);
    const labelArray = [];

    const account = await nylas.account.get();
    if (account.organizationUnit === 'label') {
      const labels = await nylas.labels.list({});
      for (const label of labels) {
        if (label.displayName !== "[Imap]/Drafts" && label.displayName !== "Drafts" && label.displayName !== "Category Forums") {
          const labelName = labelMap[label.displayName] ? labelMap[label.displayName] : label.displayName;
          labelArray.push(labelName);
        }
      }
    }

    const messageData = {};
    for (const label of labelArray) {
      const messages = await nylas.messages.list({ in: label, limit: 10 });
      const labelKey = getLabelForKey(label);

      if (!messageData[labelKey]) {
        messageData[labelKey] = [];
      }
      messages.forEach(message => {
        messageData[labelKey].push({
          ID: message.id,
          subject: message.subject,
          unread: message.unread,
          snippet: message.snippet,
         // body: message.body
        });
      });
    }
    return res.status(200).send(messageData);
  }catch(err){
    console.log(err);
    return res.status(500).send("could not send email")
  }
}

const starEmail = async(req,res) => {
  const userEmail = req.body.email;
  const starredEmail = req.body.starredEmail;
  try {
    let user = await User.findOne({ email: userEmail });

    if (!user) {
      user = new User({
        email: userEmail,
        starredEmails: [starredEmail],
      });
    } else {
      user.starredEmails.push(starredEmail[0]);
    }

    const savedUser = await user.save();
    return res.status(200).json(savedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error saving starred email.' });
  }
}

const getStarredMail = async(req,res) =>{
  const userEmail = req.body.email;

  try {
    const user = await User.findOne({ email: userEmail });

    if (user) {
      const starredEmails = user.starredEmails;
      return res.status(200).json(starredEmails);
    } else {
      return res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error fetching starred emails.' });
  }
}

const scheduleMail = async(req,res) => {
  const userEmail = req.body.email;
  const scheduledEmail = req.body.scheduledEmail;
  try {
    let user = await User.findOne({ email: userEmail });

    if (!user) {
      user = new User({
        email: userEmail,
        scheduledEmails: [scheduledEmail],
      });
    } else {
      user.scheduledEmails.push(scheduledEmail[0]);
    }

    const savedUser = await user.save();

    const schedulingTime =  scheduledEmail[0].scheduledAt; 
    // convert this schedulig time to '* * * * *' as per node-cron doc
    cron.schedule(schedulingTime, async () => {
      try {
        token = "t4qLPsX1c2KMCXpGMP3Qe6BVce0xBx";
        const nylas = NylasCongif.with(token);

        const draft = new Draft(nylas, {
          subject: scheduledEmail[0].subject,
          body: scheduledEmail[0].body,
          to: scheduledEmail[0].recipient_array
        });
        await draft.send();
        //once the send is successful try to delete from scheduled array
        console.log('Scheduled email sent:', scheduledEmail);
      } catch (error) {
        console.error('Error sending scheduled email:', error);
      }
    });

    return res.status(200).json(savedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error scheduling email.' });
  }
}

const getScheduledMail = async(req,res) =>{
  const userEmail = req.body.email;

  try {
    const user = await User.findOne({ email: userEmail });

    if (user) {
      const scheduledEmails = user.scheduledEmails;
      return res.status(200).json(scheduledEmails);
    } else {
      return res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error fetching scheduled emails.' });
  }
}

module.exports = {
  getUsers,
  sendEmail,
  readInbox,
  starEmail,
  getStarredMail,
  scheduleMail,
  getScheduledMail
};
