const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const cors = require('cors');

const users = require('./routes/api/users');
const courses = require('./routes/api/courses');
const teachers = require('./routes/api/teachers');
const downloads = require('./routes/api/downloads');
const classApplications = require('./routes/api/applications');

const app = express();

app.use(cors());

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const db = require('./config/keys').mongoURI;
// Connect to mongoDB 45302
mongoose
	.connect(db, { useNewUrlParser: true })
	.then(() => console.log('Mongo data base connected'))
	.catch(err => console.log(err));

const pathName = path.join(__dirname, 'www');
app.use('/', express.static(pathName));

// Using Routes
app.use('/api/downloads', downloads);
app.use('/api/users', users);
app.use('/api/courses', courses);
app.use('/api/teachers', teachers);
app.use('/api/classapplications', classApplications);

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

const port = process.env.PORT || 9000;

app.listen(port, () => console.log(`Server running on port ${port}`));
