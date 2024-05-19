const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');

const authRouter = require('./routes/auth')
const homeRouter = require('./routes/home')
const profileRouter = require('./routes/users')
const dotenv = require('dotenv')
const passport = require('passport')
const { default: mongoose } = require('mongoose');
const session = require('express-session');
const app = express();
dotenv.config()
app.use(session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session())

//DB Connection
mongoose.connect(`mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_PASSWORD}@cluster0.0hb5vku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(() => console.log("MongoDb Connection successfull!"))
.catch((err) => {console.log(err)})



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/auth', authRouter);
app.use('/home', homeRouter);
app.use('/profile',profileRouter);

// Initialize Passport

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
