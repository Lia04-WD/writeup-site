const express = require('express');
const session = require('express-session')
const path = require('path');
const nunjucks = require('nunjucks');
require('dotenv').config();

const auth = require('./auth/auth');
const isPassed = require('./auth/isPassed');
const mainRouter = require('./mainRouter');

const app = express();
app.set('port', process.env.PORT);
app.set('trust proxy', 1);

nunjucks.configure('main/html', {
    express: app,
    watch: true,
});
app.set('view engine', 'html');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 60 * 1000
    }
}));

app.post('/verify', auth);
app.use('/main', isPassed, mainRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    if (req.session.isPassed) return res.redirect('/main');
    res.sendFile(path.join(__dirname, '/public/password/index.html'));
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), 'on listening!');
});
