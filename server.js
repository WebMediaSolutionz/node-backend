const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

let messages = [{
    text: 'some text',
    owner: 'tim'
},
{
    text: 'other text',
    owner: 'jane'
}];

let users = [{
    id: 0,
    firstname: 'max',
    email: 'mpierre@pulseinc.com',
    password: 'password01'
}];

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

api.get('/users/me', checkAuthenticated, (req, res) => {
    let index = req.user;

    res.json(users[index]);
});

api.post('/users/me', checkAuthenticated, (req, res) => {
    let user = users[req.user];

    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;

    res.json(user);
});

auth.post('/login', (req, res) => {
    let unauthenticatedUser = req.body;

    let user = users.find((user) => user.email === unauthenticatedUser.email);

    if (!user) {
        sendAuthError(res);
    }

    if (user.password === unauthenticatedUser.password) {
        sendToken(user, res);
    } else {
        sendAuthError(res);
    }
});

auth.post('/register', (req, res) => {
    let newUser = req.body;
    let index = users.push(newUser) - 1;
    let user = users[index];

    user.id = index;

    sendToken(user, res);
});

function sendToken(user, res) {
    let token = jwt.sign(user.id, '123');

    res.json({firstname: user.firstname, token});
}

function sendAuthError(res) {
    return res.json({success: false, message: 'email or password incorrect'});
}

function checkAuthenticated(req, res, next) {
    if (!req.header('authorization')) {
        return res.status(401).send({message: 'Unauthorized request. Missing authentication header'});
    }

    let token = req.header('authorization').split(' ')[1];

    let payload = jwt.decode(token, '123');

    if (!payload) {
        return res.status(401).send({message: 'Unauthorized request. Authentication header invalid'});
    }

    req.user = payload;

    next();
}

app.use('/api', api);
app.use('/auth', auth);

app.listen(63145);