const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const passport = require('passport');
const connectDB = require('./config/db.js');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const auth = require('./routes/api/auth');
const path =require('path');
// const session = require('express-session');

const app = express();

// Body parser middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(express.json({extended:false}));


// Connect to MongoDB
connectDB();

// Passport middleware
// app.use(passport.initialize());

// app.use(session({
//   secret: 'secret',
//   saveUninitialized: true,
//   resave: true
// }));


// Passport Config
// require('./config/passport')(passport);

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use('/api/auth', auth);

//sere static assest in production
if(process.env.NODE_ENV =='production'){
    app.use(express.static('client/build'))

    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

// app.get('/', (req,res)=> res.send('Api Running'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
