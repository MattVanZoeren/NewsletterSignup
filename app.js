//jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get('/', function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post('/', function(req, res){
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                        FNAME: firstname,
                        LNAME: lastname,
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/71b683e561"

    const options = {
        method: 'POST',
        auth: 'mattvanzoeren:6c345bbcb423a49c9facf76c3cc01267-us17'
    }

    const request = https.request(url, options, function(response){

        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on('data', function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

    console.log(firstname, lastname, email);
});

app.post('/failure', function(req, res){
    res.redirect('/');
})


app.listen(process.env.PORT || 3000, function(){
    console.log('Server is running on port 3000');
});



// audience id for mailchimp: 71b683e561
// api key for mailchimp: 6c345bbcb423a49c9facf76c3cc01267-us17