const express = require('express');
const session = require('express-session');
const { engine } = require('express-handlebars');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');

// set config filepath for dotenv
dotenv.config({ path: './config/config.env'});

const PORT = process.env.PORT;

connectDB();

const app = express();
app.use(express.static('./public'));

// middlewares:

// logging with morgan
app.use(morgan('dev'))

// body parsers
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
)

// express session
app.use(session({
  secret: 'shhhh',
  resave: false,
  saveUninitialized: false,
  unset: 'destroy',
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
}))

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// handlebars helper
const { formatDate, truncateString, stripTags, editIcon, select } = require('./helpers/handlebars');
const { populate } = require('./models/Quotes');

// express handlebars
app.engine('.hbs', engine({
  helpers: {
    formatDate,
    truncateString,
    stripTags,
    editIcon,
    select
  },
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');
app.set('views', './views');

// global user variable
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next();
});

// routing
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/quotes', require('./routes/quotes'));

const server = app.listen(PORT, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Nodejs server running in ${process.env.NODE_ENV} mode on http://${host}:${port}`);
})