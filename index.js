
const winston = require('winston');
const error = require('./middleware/error')
const config = require('config');
const express = require('express');
const app = express();
const users = require('./routes/user.route');
const auth = require('./routes/auth.route');
const mongoose = require('mongoose');
// require('./startup/logging')();
// require('./startup/routes')(app);
// require('./startup/db')();
// require('./startup/config')();
// require('./startup/validation')();

process.on('uncaughtException', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1)
});

winston.handleExceptions(
    new winston.transports.File({filename:'uncaughtExceptions.log'})
)

process.on('unhandledRejection', (ex) => {
    throw ex;
});

winston.add(winston.transports.File, { filename: 'logfile.log' });

// const p = Promise.reject(new error('Somethig failed'));
// p.then(() => console.log('something done'));

// throw new Error('Something failed');

if (!config.get('jwtPrivateKey')) {
    console.error('jwt is not defined');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/users')
    .then(() => console.log('connected to mongodb'))
    .catch(err => console.err('could not connect to mongodb', err))

app.use(express.json());

app.use('/api/users', users);
app.use('/api/auth', auth);


app.use(error);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => console.log(`Listening on Port ${port}`))

module.exports = server;
