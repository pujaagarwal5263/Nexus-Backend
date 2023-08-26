let token;
const {NylasCongif} =require("../nylas-config");
const { default: Draft } = require('nylas/lib/models/draft');

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
  return value; // Return null if value is not found
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
    //read mail for sent box
    // nylas.messages.first({in: 'sent'}).then(message =>{
    //   console.log(`Subject: ${message.subject} | ID: ${message.id} | Unread: ${message.unread}`);
    // });
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
    //console.log(labelArray);
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

module.exports = {
  getUsers,
  sendEmail,
  readInbox
};
