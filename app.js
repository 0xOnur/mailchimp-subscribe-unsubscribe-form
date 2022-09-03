const express = require("express");
const bodyParser = require("body-parser");
const MD5 = require("crypto-js/md5");
const mailChimp = require('@mailchimp/mailchimp_marketing');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));


const apiKey = "enter here";
const serverPrefix = "enter here";
const list = "enter here";


app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post('/signup', (req, res) => {
    const name = req.body.name;
    const lastName = req.body.lastName;
    const email = req.body.email;

    mailChimp.setConfig({
        apiKey: apiKey,
        server: serverPrefix,
    });

    const run = async () => {
        mailChimp.lists.addListMember(
            list,
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: name,
                    LNAME: lastName,
                },
            },
            {
                skipMergeValidation: false
            }
        ).then(() => {
            res.sendFile(__dirname + "/success.html");
            
        }).catch((error) => {
            res.sendFile(__dirname + "/failure.html");

        });
    };
      
    run();

});


app.get('/unsubscribe', (req, res) => {
    res.sendFile(__dirname + "/unsubscribe.html");
});

app.post('/unsubscribe', (req, res) => {
    let email = req.body.email;
    emailHash = MD5(email.toLowerCase()).toString();


    mailChimp.setConfig({
        apiKey: apiKey,
        server: serverPrefix,
    });

    const run = async () => {
        mailChimp.lists.deleteListMember(
          list,
          emailHash,
        ).then(() => {
            res.sendFile(__dirname + "/success.html");
            
        }).catch((error) => {
            res.sendFile(__dirname + "/failure.html");

        });
      };
      
    run();

});


app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port 3000`);
});
