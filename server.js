// port number to be used, any unused port number will do here.
const portNumber = 63145;

// loading relevant packages
const express = require('express');
const bodyParser = require('body-parser');
const utils = require('./utils');

// app definition
const app = express();

// loading "mock" data to be served
let messages = require('./data/messages');
let users = require('./data/users');
let clients = require('./data/clients');
let passwordRules = require('./data/password-rules');

// middleware: makes server be able to receive json objects
app.use(bodyParser.json());

// middleware: allows cross-origin requests
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// defining routers, one for general web API routes and one for Authentication API routes
let api  = express.Router();
let auth  = express.Router();

// messages API
api.get('/messages', (req, res) => {
    // returns messages
    res.json(messages);
});

api.get('/messages/:user', (req, res) => {
    // returns a particular user's messages
    let user = req.params.user;
    let result = messages.filter(message => message.owner == user);

    res.json(result);
});

api.post('/message', (req, res) => {
    // saves new message to messages array
    let message = req.body;

    messages.push(message);
    return res.json(message);
});

// users API
api.get('/users/me', utils.checkAuthenticated, (req, res) => {
    // returns current user
    let index = req.user;

    res.json(users[index]);
});

api.post('/users/me', utils.checkAuthenticated, (req, res) => {
    // save current user's information
    let user = users[req.user];

    user.account = req.body.account;
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.username = req.body.username;
    user.password = req.body.password;
    user.role = req.body.role;

    res.json(user);
});

// clients API
api.get('/clients', (req, res) => {
    // returns clients
    res.json(clients);
});

api.get('/clients/:clientid', (req, res) => {
    // returns client
    let clientid = req.params.clientid;
    let result = clients.filter(client => client.clientid == clientid);

    res.json(result);
});

api.post('/saveclient', (req, res) => {
    // save client info
    let client = clients[req.client];

    client = req.body;

    res.json(client);
});

// password-rules API
api.get('/password-rules', (req, res) => {
    // returns password rules
    res.json(passwordRules);
});

api.post('/password-rules', (req, res) => {
    // save password rules
    passwordRules = req.body;

    res.json(passwordRules);
});

// authentication API
auth.post('/login', (req, res) => {
    let unauthenticatedUser = req.body;

    let user = users.find((user) => user.username === unauthenticatedUser.username);

    if (!user) {
        utils.sendAuthError(res);
    }

    if (user.password === unauthenticatedUser.password) {
        utils.sendToken(user, res);
    } else {
        utils.sendAuthError(res);
    }
});

// registration API
auth.post('/register', (req, res) => {
    let newUser = req.body;
    let index = users.push(newUser) - 1;
    let user = users[index];

    user.id = index;

    utils.sendToken(user, res);
});

app.use('/api', api);
app.use('/auth', auth);

// launch server
app.listen(portNumber);