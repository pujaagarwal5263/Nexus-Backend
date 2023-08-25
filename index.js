const express = require('express');
const app=express();
const Nylas = require('nylas');
require('./db-connection')
const router = require('./routes/router');
const { configDotenv } = require('dotenv');
app.use(router);
configDotenv();

Nylas.config({
    clientId: process.env.NYLAS_CLIENT_ID,
    clientSecret: process.env.NYLAS_CLIENT_SECRET
});

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
    
const nylas = Nylas.with(process.env.ACCESS_TOKEN);
// test connection
// nylas.account.get().then(account => console.log(account));
const draft = nylas.drafts.build({
    subject: "First mail with nylas",
    body: "Keep it all secret!",
    to: [{name:"Geek Puja",email:"puja@geekyants.com"}]
})

draft.send().then((msg)=>{
    console.log(msg);
})

app.listen(8000,()=>{
    console.log("Server running at 8000");
})