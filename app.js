const express = require('express')
const mongoose = require("mongoose")
var exphbs = require('express-handlebars')
const path = require("path")
const dotevn = require("dotenv")
const morgan = require("morgan")
const methodOverride = require("method-override")
//const nodemailer = require('nodemailer')
const passport = require("passport")
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
//storing the session in mongodb
const connectDB = require('./config/db')
const app = express();

//load config
dotevn.config({path: './config/config.env'})

//load passportjs
require("./config/passport")(passport)


//Session
app.use(
    session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    //storing the session in mongodb
    store: new MongoStore({ mongooseConnection: mongoose.connection})
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set Global Var
app.use(function(req,res,next){
    res.locals.user = req.user || null
    next()
})



//load db
connectDB()

app.use(express.urlencoded({ extended: false}))
app.use(express.json())
//Method override
app.use(
    methodOverride(function(req, res){
        if (req.body && typeof req.body === 'object' && '_method' in req.body){
            //look in urlencoded POST bodies and delete
            let method = req.body._method
            delete req.body._method
            return method
        }
    })
)

//loading morgan in development mode
app.use(morgan('dev'))

//handlebars helpers
const { formatDate, stripTags, truncate, editIcon, select} = require("./helpers/hbs")

app.engine('hbs', exphbs.engine({extname: '.hbs',
 helpers: { formatDate, stripTags, truncate, editIcon, select},
  defaultLayout:"main"}));
app.set('view engine', 'hbs');

//app.set("view engine", '.hbs')
//app.engine('.hbs', exphbs.engine({layoutsDir:__dirname + '/views/layouts'}))

app.use(express.static(path.join(__dirname, './public/css')))

//routes
app.use('/', require("./routes/index"))
app.use('/', require("./routes/auth"))
app.use('/', require("./routes/stories"))
app.use('/', require('./routes/usersprofile'))
app.use('/auth', require("./routes/auth"))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    
    console.log("server is listening to "+ PORT);
});