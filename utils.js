const jwt = require('jsonwebtoken');
const secret = '123';

const utils = {
    sendToken: (user, res) => {
        let token = jwt.sign(user.id, secret);

        res.json({firstname: user.firstname, token});
    },

    sendAuthError: (res) => {
        return res.json({success: false, message: 'Email or Password incorrect'});
    },

    checkAuthenticated: (req, res, next) => {
        if (!req.header('authorization')) {
            return res.status(401).send({message: 'Unauthorized request. Missing authentication header'});
        }

        let token = req.header('authorization').split(' ')[1];

        let payload = jwt.decode(token, secret);

        if (!payload) {
            return res.status(401).send({message: 'Unauthorized request. Authentication header invalid'});
        }

        req.user = payload;

        next();
    }
};

module.exports = utils;