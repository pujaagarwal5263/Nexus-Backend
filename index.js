const express = require('express');
const bodyParser = require('body-parser'); // Require body-parser
const app=express();
app.use(bodyParser.json());
require('./db-connection')
const router = require('./routes/router');
app.use(router);

// Nylas.accounts.list().then(accounts => {
//     for (let account of accounts) {
//       console.log(
//         `Email: ${account.emailAddress} | `,
//         `Billing State: ${account.billingState} | `,
//         `Sync State: ${account.syncState}`,
//         `ID: ${account.id}  | `
//       );
//     }
//   });  
    

// test connection
// nylas.account.get().then(account => console.log(account));
// const draft = nylas.drafts.build({
//     subject: "First mail with nylas",
//     body: "Keep it all secret!",
//     to: [{name:"Geek Puja",email:"puja@geekyants.com"}]
// })

// draft.send().then((msg)=>{
//     console.log(msg);
// })

// const nylas = NylasCongif.with(process.env.ACCESS_TOKEN);
// nylas.messages.first({in: 'sent'}).then(message =>{
//     console.log(`Subject: ${message.subject} | ID: ${message.id} | Unread: ${message.unread}`);
// });

// nylas.account.get().then(account =>{
//     if (account.organizationUnit == 'label') {
//         nylas.labels.list({}).then(labels => {
//             console.log("This account contains the following labels:")
//             for (const label of labels) {
//               console.log(`Name: ${label.displayName} | ID: ${label.id}`);
              
//             }
//           });
//     }
// });

app.listen(8000,()=>{
    console.log("Server running at 8000");
})

