/* eslint-disable @typescript-eslint/no-require-imports */


const express = require('express');
const db = require('./db');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    passport.use(new localStrategy({ usernameField: 'email' },(email, password, done) => {
        const query = 'SELECT * FROM skole.user WHERE email = ?';
        db.query(query, [email], (err, result) => {
            if(err) {
                console.log('Error');
                throw err;
            }
            //no user with that email found
            if(result.length === 0) {
                console.log('No user with that email');
                return done(null, false);
            }
            //compare the password entered with the hashed password in the database
            bcrypt.compare(password, result[0].password, (err, response) => {
                if(err) {
                    console.log('Error comparing passwords');
                    throw err;
                }
                //passwords match
                if(response === true) {
                    console.log('Passwords match');
                    return done(null, result[0]);
                }
                //passwords don't match
                else{
                    console.log('Passwords don\'t match');
                    return done(null, false);
                }
            });
        });
    }))
    
    passport.serializeUser((user, done) => {
        done(null, user.user_id);
    });

    passport.deserializeUser((id, done) => {
        const query = 'SELECT * FROM skole.user WHERE user_id = ?';
        db.query(query, [id], (err, result) => {
            if(err) {
                throw err;
            }
            const userinfo = {
                id: result[0].user_id,
                email: result[0].email,
                role: result[0].role
            }
            done(null, userinfo);
        });
    });
    ;}