const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const utils = require('./utils');
const portNumber = 63145;

// TODO: hardcoded data should be external to this file
let messages = [
    {
        text: 'some text',
        owner: 'tim'
    },
    {
        text: 'other text',
        owner: 'jane'
    }
];

let users = [
    {
        id: 0,
        account: 'QB1486',
        firstname: 'maxime',
        lastname: 'pierre',
        username: 'doctor',
        password: 'orthodoc'
    }
];

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

let api  = express.Router();
let auth  = express.Router();

api.get('/messages', (req, res) => {
    res.json(messages);
});

api.get('/messages/:user', (req, res) => {
    let user = req.params.user;
    let result = messages.filter(message => message.owner == user);

    res.json(result);
});

api.post('/messages', (req, res) => {
    let message = req.body;

    messages.push(message);
    return res.json(message);
});

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

auth.post('/register', (req, res) => {
    let newUser = req.body;
    let index = users.push(newUser) - 1;
    let user = users[index];

    user.id = index;

    utils.sendToken(user, res);
});

app.use('/api', api);
app.use('/auth', auth);

app.listen(portNumber);