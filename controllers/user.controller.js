const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/user.mode');
const bcrypt = require('bcrypt');
const config = require('config');

async function get(req, res) {
    try {
        const users = await User.find({});
        return res.send(users);
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

async function create(req, res, next) {
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    try {
        let existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send('User already registered');
        }
        let user = new User(req.body);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        const newUser = await user.save();
        // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'))
        const token = user.generateAuthToken();
        return res.header('x-auth-token', token).send(newUser);
    } catch (ex) {
        next(ex);
    }
}

async function getUserById(req, res) {
    try {
        const user = await User.findById(req.params.userId);
        return res.status(200).send(user);
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

async function update(req, res, next) {
    let user = await User.findById(req.params.userId);
    if (!user) res.status(404).send('user not found')
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        user = Object.assign(user, req.body);
        const newUser = await user.save();
        return res.status(202).send(newUser);
    } catch (ex) {
        next(ex);
    }
}

function validateUser(user) {
    const schema = {
        name: Joi.string().min(3).required(),
        email: Joi.string().required(),
        password: Joi.string().required()
    }
    return Joi.validate(user, schema);
}

module.exports = {
    get,
    create,
    update,
    validateUser,
    getUserById
};