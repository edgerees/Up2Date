require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('./config/ppConfig');
const flash = require('connect-flash');
const SECRET_SESSION = process.env.SECRET_SESSION;
const app = express();
const bodyParser = require('body-parser')

// isLoggedIn middleware
const isLoggedIn = require('./middleware/isLoggedIn');

const router = require('./routes/news');



app.set('view engine', 'ejs');
app.use(require('morgan')('dev'));
app.use('/css', express.static(__dirname +'public/css'));
app.use('/img', express.static(__dirname +'public/img'));
app.use('/js', express.static(__dirname +'public/js'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
app.use(bodyParser.urlencoded({extended : true}))
// secret: What we actually will be giving the user on our site as a session cookie
// resave: Save the session even if it's modified, make this false
// saveUninitialized: If we have a new session, we save it, therefore making that true

const sessionObject = {
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}

app.use(session(sessionObject));

// Initialize passport and run through middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash
// Using flash throughout app to send temp messages to user
app.use(flash());

// Messages that will be accessible to every view
app.use((req, res, next) => {
  // Before every route, we will attach a user to res.local
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', (req, res) => {
  console.log(res.locals.alerts);
  res.render('index', { alerts: res.locals.alerts });
});

//use this to make sure user is logged in.
app.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});


app.use('/auth', require('./routes/auth'));
app.use('/news', require('./routes/news'))
app.use('/', router);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});


module.exports = server;
