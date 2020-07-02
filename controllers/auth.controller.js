
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const User = require('../models/user.mode');

async function login(req, res) {
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send('email or password incorrect');
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).send('email or password incorrect');
        }
        // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'))
        const token = user.generateAuthToken();
        return res.send(token);
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

function validateUser(user) {
    const schema = {
        email: Joi.string().required(),
        password: Joi.string().required()
    }
    return Joi.validate(user, schema);
}

module.exports = {
    login
};