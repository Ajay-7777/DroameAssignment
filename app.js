const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const Register = require('./server/models/Register');
const flash = require('connect-flash');
const {json}=require('express')
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
const auth=require("./server/middleware/auth");
app.use(express.urlencoded( { extended: true } ));
app.use(express.static('public'));
app.use(expressLayouts);
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}));
app.use(cookieParser('RecipeBlogSecure'));
app.use(session({
  secret: 'RecipeBlogSecretSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(fileUpload());

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

const routes = require('./server/routes/recipeRoutes.js')

app.use('/', routes);

app.listen(port, ()=> console.log(`Listening to port ${port}`));