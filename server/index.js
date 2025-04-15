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



app.post('/adduser', (req, res) => {
  const { email, password, phone_number, first_name, last_name, role: roleStr } = req.body;
  const school_id = 1; // Hardcoded school_id as per instruction
  const role = parseInt(roleStr, 10); // Convert role to integer

  const insertQuery = `
    INSERT INTO user 
      (password, email, phone_number, first_name, last_name, role) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const checkUserQuery = 'SELECT * FROM user WHERE email = ?';

  // Check if user already exists
  db.query(checkUserQuery, [email], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (result.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password and create user
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.query(
      insertQuery,
      [hashedPassword, email, phone_number, first_name, last_name, role],
      (err, result) => {
        if (err) {
          console.error('Error creating user:', err);
          return res.status(500).json({ message: 'Error creating user' });
        }
        res.status(201).json({ message: 'User created successfully' });
      }
    );
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

// Course Creation API
app.post('/createcourse', (req, res) => {
  const { course_name, course_description } = req.body;
  
  const checkCourseQuery = 'SELECT * FROM courses WHERE course_name = ?';
  const insertCourseQuery = `
    INSERT INTO courses 
      (course_name, course_description) 
    VALUES (?, ?)
  `;

  db.query(checkCourseQuery, [course_name], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (result.length > 0) {
      return res.status(409).json({ message: 'Course already exists' });
    }

    db.query(
      insertCourseQuery,
      [course_name, course_description],
      (err, result) => {
        if (err) {
          console.error('Error creating course:', err);
          return res.status(500).json({ message: 'Error creating course' });
        }
        res.status(201).json({ 
          message: 'Course created successfully',
          course_id: result.insertId
        });
      }
    );
  });
});

app.get('/getCourses', (req, res) => {
  const query = 'SELECT * FROM courses';

  db.query(query, (err, result) => {
      if (err) {
        console.log(err +" error in getCourses");
      }
      console.log(result)
      res.send(result);
  });
});

// Backend API Endpoint (server.js)
app.get('/modules', (req, res) => {
  const query = `
    SELECT 
      m.module_id,
      m.module_name,
      m.module_date,
      m.module_start_time,
      m.module_end_time,
      m.course_id,
      m.teacher_id,
      c.course_name
    FROM modules m
    LEFT JOIN courses c ON m.course_id = c.course_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch modules'
      });
    }

    // Format dates and times to ISO strings
    const formattedModules = results.map(module => ({
      ...module,
      module_date: new Date(module.module_date).toISOString().split('T')[0],
      module_start_time: module.module_start_time.toString().slice(0, 8),
      module_end_time: module.module_end_time.toString().slice(0, 8)
    }));

    res.json(formattedModules);
  });
});

app.post('/createModule', (req, res) => {
  const { course_id, module_start_time, module_end_time, module_date } = req.body;

  // First get the course name
  const getCourseQuery = 'SELECT course_name FROM courses WHERE course_id = ?';
  
  db.query(getCourseQuery, [course_id], (err, courseResult) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (courseResult.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const course_name = courseResult[0].course_name;

    // Now insert with course name
    const insertModuleQuery = `
      INSERT INTO modules (
        module_name,
        module_date,
        course_id,
        module_start_time,
        module_end_time
      ) VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertModuleQuery, 
      [course_name, module_date, course_id, module_start_time, module_end_time],
      (err, moduleResult) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ success: false, message: 'Failed to create module' });
        }

        res.status(201).json({
          success: true,
          message: 'Module created successfully',
          moduleId: moduleResult.insertId,
          moduleName: course_name
        });
      }
    );
  });
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});


app.get('/course/:id', (req, res) => {
  const courseId = req.params.id;
  const query = 'SELECT * FROM skole.courses WHERE course_id = ?';
  
  db.query(query, [courseId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.length === 0) return res.status(404).json({ error: 'Course not found' });
    
    res.json(result[0]);
  });
});

// In your API endpoint
app.get('/courses/:courseId/teachers', (req, res) => {
  const courseId = req.params.courseId;
  
  const query = `
      SELECT 
          u.user_id, 
          u.first_name, 
          u.last_name, 
          u.email 
      FROM user u
      WHERE u.user_id IN (
          SELECT teacher_id 
          FROM teaches 
          WHERE course_id = ?
      )
  `;

  db.query(query, [courseId], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
  });
});

// Get available teachers for a course
app.get('/courses/:courseId/available-teachers', (req, res) => {
  const courseId = req.params.courseId;
  // remember to add school id to the query later
  const query = `
      SELECT u.user_id, u.first_name, u.last_name, u.email 
      FROM user u
      WHERE u.user_id NOT IN (
          SELECT teacher_id FROM teaches WHERE course_id = ?
      )
  `;

  db.query(query, [courseId, courseId], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
  });
});

// Assign teacher to course
app.post('/courses/:courseId/assign-teacher', (req, res) => {
  const courseId = req.params.courseId;
  const { teacherId } = req.body;

  const query = `
      INSERT INTO teaches (teacher_id, course_id)
      VALUES (?, ?)
  `;

  // First validate teacher exists and is a teacher
  db.query(
      'SELECT * FROM user WHERE user_id = ?',
      [teacherId],
      (err, results) => {
          if (err || results.length === 0) {
              return res.status(400).json({ error: 'Invalid teacher' });
          }
          
          db.query(query, [teacherId, courseId], (err, result) => {
              if (err) {
                  if (err.code === 'ER_DUP_ENTRY') {
                      return res.status(409).json({ error: 'Teacher already assigned' });
                  }
                  return res.status(500).json({ error: 'Assignment failed' });
              }
              res.json({ success: true });
          });
      }
  );
});
app.delete('/courses/delete/:courseId', (req, res) => {
  const courseId = req.params.courseId;
  
  // First check if course exists
  const checkQuery = 'SELECT * FROM courses WHERE course_id = ?';
  const deleteQuery = 'DELETE FROM courses WHERE course_id = ?';

  db.query(checkQuery, [courseId], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0) {
          return res.status(404).json({ error: 'Course not found' });
      }

      db.query(deleteQuery, [courseId], (err, result) => {
          if (err) {
              console.error('Delete error:', err);
              return res.status(500).json({ error: 'Failed to delete course' });
          }
          
          res.json({ success: true });
      });
  });
});
app.delete('/courses/:courseId/teachers/delete/:teacherId', (req, res) => {
  const { courseId, teacherId } = req.params;
  
  const query = `
    DELETE FROM teaches 
    WHERE course_id = ? 
    AND teacher_id = ?
  `;

  db.query(query, [courseId, teacherId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Teacher not assigned to this course' });
    }

    res.json({ success: true });
  });
});


// Get enrolled students
app.get('/courses/:courseId/students', async (req, res) => {
      const query =`
          SELECT u.user_id, u.first_name, u.last_name, u.email 
          FROM courseEnrollments ce
          JOIN user u ON ce.student_id = u.user_id
          WHERE ce.course_id = ?
      `;
      const courseId = req.params.courseId;
  db.query(query, [courseId, courseId], (err, results) => {
    if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
});
});

// Get available students for enrollment
app.get('/courses/:courseId/available-students', async (req, res) => {

      const query = `
          SELECT u.user_id, u.first_name, u.last_name, u.email 
          FROM user u
          WHERE u.role = 1 
          AND u.user_id NOT IN (
              SELECT student_id FROM courseEnrollments WHERE course_id = ?
          )`;
      const courseId = req.params.courseId;
      // remember to add school id to the query later
          db.query(query, [courseId, courseId], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        });
    });

/// Enroll student
app.post('/courses/:courseId/enroll', (req, res) => {
  const courseId = req.params.courseId;
  const { studentId } = req.body;

  const query = 'INSERT INTO courseEnrollments (student_id, course_id) VALUES (?, ?)';
  
  db.query(query, [studentId, courseId], (err, result) => {
      if (err) {
          console.error('Enrollment error:', err);
          return res.status(500).json({ error: 'Failed to enroll student' });
      }
      res.status(201).json({ success: true });
  });
});

// Unenroll student
app.delete('/courses/:courseId/students/delete/:studentId', (req, res) => {
  const { courseId, studentId } = req.params;
  const query = 'DELETE FROM courseEnrollments WHERE course_id = ? AND student_id = ?';
  
  db.query(query, [courseId, studentId], (err, result) => {
      if (err) {
          console.error('Unenrollment error:', err);
          return res.status(500).json({ error: 'Failed to unenroll student' });
      }
      
      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Enrollment not found' });
      }
      
      res.json({ success: true });
  });
});



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

