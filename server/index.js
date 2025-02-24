/* eslint-disable @typescript-eslint/no-require-imports */

// nodemon for automatically restarting the server
// axios for sending http requests
//bcrypt for encrypting passwords
// cors for handling the location of our requests
// express for handling our backend framework
// express-session for handling our session middleware
// cookie-parser for handling our cookies with our user information
// mysql for handling our sql connection and queries
// passport and passport-local for handling our authentication

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const expressSession = require('express-session');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const bcrypt = require('bcrypt');

const db = require('./db');
const { error } = require('console');

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(expressSession({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(cookieparser('secret'));
app.use(passport.initialize());
app.use(passport.session());

require('./passportConfiguration')(passport);

app.get('/', (req, res) => {
    res.send('Hello World');
});



app.post('/signup', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const role = 1;
    const query = 'INSERT INTO user (email, password, role) VALUES (?, ?, ?)';
    const query2 = 'SELECT * FROM user WHERE email = ?';

    db.query(query2, [email], (err, result) => {
        if(err) {
            throw err;
        }
        if(result.length > 0) {
            res.send('User already exists');
        }
        if(result.length === 0) {
            const hashedPassword = bcrypt.hashSync(password, 10);
           db.query(query, [email, hashedPassword, 1], (err, result) => {
               if(err) {
                   throw err;
               }
               res.send('User created');

           });
        }
    });
});

app.post('/login', (req, res,next) => {
    passport.authenticate('local', (err, user,info) => {
        if(err) {
            throw err;
        }
        if(!user) {
            res.send('No user exists');
        }
        else {
            req.logIn(user, (err) => {
                if(err) {
                    throw err;
                }
                res.send('Successfully authenticated');
                console.log(req.user);
            });
        } 
    })(req, res, next);
});

app.get('/getUser', (req, res) => {
    res.send(req.user);
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});


app.get('/getAllUsers', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const role = 1;
    const query2 = 'SELECT email,role FROM user';

    db.query(query2, (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result)
        res.send(result);
    });
});


