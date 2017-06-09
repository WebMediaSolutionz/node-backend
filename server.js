// loading relevant packages
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const utils = require('./utils');
const portNumber = 63145;

// loading data
let messages = require('./data/messages');
let users = require('./data/users');
let clients = require('./data/clients');

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// defining routes
let api  = express.Router();
let auth  = express.Router();

// messages API
api.get('/messages', utils.checkAuthenticated, (req, res) => {
    res.json(messages);
});

api.get('/messages/:user', utils.checkAuthenticated, (req, res) => {
    let user = req.params.user;
    let result = messages.filter(message => message.owner == user);

    res.json(result);
});

api.post('/messages', utils.checkAuthenticated, (req, res) => {
    let message = req.body;

    messages.push(message);
    return res.json(message);
});

// users API
api.get('/users/me', utils.checkAuthenticated, (req, res) => {
    let index = req.user;

    res.json(users[index]);
});

api.post('/users/me', utils.checkAuthenticated, (req, res) => {
    let user = users[req.user];

    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;

    res.json(user);
});

// clients API
api.get('/api/client', utils.checkAuthenticated, (req, res) => {
    res.json(clients);
});

api.get('/api/client/:clientid', utils.checkAuthenticated, (req, res) => {
    let clientid = req.params.clientid;
    let result = clients.filter(client => client.clientid == clientid);

    res.json(result);
});

api.post('/api/saveclient', utils.checkAuthenticated, (req, res) => {
    let client = clients[req.client];

    client = req.body;

    res.json(client);
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