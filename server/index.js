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
const jwt = require('jsonwebtoken');
const { start } = require('repl');

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    try {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT (no need for req.logIn)
      const token = jwt.sign(
        { userId: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Send token to client
      res.json({ token });
      
    } catch (error) {
      next(error); // Forward errors to Express error handler
    }
  })(req, res, next);
});

app.get('/timeslots', (req, res) => {
  const query = 'SELECT module_start_time, module_end_time FROM modules WHERE module_date = ?';

  const date = req.query.date;
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  console.log(date + " " + req.body)

  db.query(query, [date], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const times = results.map(row => ({
      start: row.module_start_time,
      end: row.module_end_time
    }));
  console.log("all of times "+times);
  res.send(times);
  
  })
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
    const query2 = 'SELECT email,role,user_id FROM user';

    db.query(query2, (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result)
        res.send(result);
    });
});
//deepseek made this
app.get('/teacher/:id', (req, res) => {
  const teacherId = req.params.id;
  const query = 'SELECT * FROM skole.user WHERE user_id = ?';
  
  db.query(query, [teacherId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.length === 0) return res.status(404).json({ error: 'Teacher not found' });
    
    res.json(result[0]);
  });
});

app.get('/studenttimeslots', (req, res) => {
  const query = 'SELECT m.module_date, m.module_start_time, m.module_end_time FROM modules m JOIN courses c ON m.course_id = c.course_id JOIN enrollments e ON c.course_id = e.course_id WHERE e.user_id = ? ORDER BY m.module_date, m.module_start_time;';

  const date = req.query.date;
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  console.log(date + " " + req.body)

  db.query(query, [date], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const times = results.map(row => ({
      start: row.module_start_time,
      end: row.module_end_time
    }));
  console.log("all of times "+times);
  res.send(times);
  })
});

/* SQL query for finding the date and start and end time of a module with user id
SELECT m.module_date,
  m.module_start_time,
  m.module_end_time
FROM modules m
JOIN courses c ON m.course_id = c.course_id
JOIN enrollments e ON c.course_id = e.course_id
WHERE e.user_id = ?
ORDER BY m.module_date, m.module_start_time;
*/