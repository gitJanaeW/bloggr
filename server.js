const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// const helpers = require('./utils/helpers');
const hbs = exphbs.create({});
const routes = require('./controllers/');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
    secret: 'Secret session',
    cookie: {},
    resave: false,
    saveUnitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(routes);

// {force:false}: optional. if true, will drop and recreate db of all tables on startup. (Equiv to DROP TABLE IF EXISTS)
sequelize.sync({force: false})
    .then(() => {
        app.listen(PORT, () => console.log('Now listening'));
    })
