const express = require('express')
const app = express()
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

app.use(express.urlencoded({extended: false}))
app.use(cors({
    origin: "https://next-auth-app-six-delta.vercel.app",
    credentials: true,
    optionsSuccessStatus: 200
}))
//Middleware
app.use(session({
    proxy: true,
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: false,
        secure: false,
        sameSite: 'none',
        domain: "next-auth-app-six-delta.vercel.app"
    }
}))
app.set('view engine','ejs');
app.engine('ejs', require('ejs').__express);

app.use(passport.initialize()) // init passport on every route call
app.use(passport.session())    //allow passport to use "express-session"
app.use(express.json());

authUser = (user, password, done) => {
    console.log(`Value of "User" in authUser function ----> ${user}`)         //passport will populate, user = req.body.username
    console.log(`Value of "Password" in authUser function ----> ${password}`) //passport will popuplate, password = req.body.password

// Use the "user" and "password" to search the DB and match user/password to authenticate the user
// 1. If the user not found, done (null, false)
// 2. If the password does not match, done (null, false)
// 3. If user found and password match, done (null, user)

    let authenticated_user = { id: 123, name: "Kyle"}
//Let's assume that DB search that user found and password matched for Kyle

    return done (null, authenticated_user )
}


passport.use(new LocalStrategy (authUser))

passport.serializeUser( (user, done) => {
    console.log(`--------> Serialize User`)
    console.log(user)

    done(null, user.id)

// Passport will pass the authenticated_user to serializeUser as "user"
// This is the USER object from the done() in auth function
// Now attach using done (null, user.id) tie this user to the req.session.passport.user = {id: user.id},
// so that it is tied to the session object

} )


passport.deserializeUser((id, done) => {
    console.log("---------> Deserialize Id")
    console.log(id)

    done (null, {name: "Kyle", id: 123} )

// This is the id that is saved in req.session.passport.{ user: "id"} during the serialization
// use the id to find the user in the DB and get the user object with user details
// pass the USER object in the done() of the de-serializer
// this USER object is attached to the "req.user", and can be used anywhere in the App.

})


//Middleware to see how the params are populated by Passport
let count = 1

printData = (req, res, next) => {
    console.log("\n==============================")
    console.log(`------------>  ${count++}`)

    console.log(`req.body.username -------> ${req.body.username}`)
    console.log(`req.body.password -------> ${req.body.password}`)

    console.log(`\n req.session.passport -------> `)
    console.log(req.session.passport)

    console.log(`\n req.user -------> `)
    console.log(req.user)

    console.log("\n Session and Cookie")
    console.log(`req.session.id -------> ${req.session.id}`)
    console.log(`req.session.cookie -------> `)
    console.log(req.session.cookie)

    console.log("===========================================\n")

    next()
}

app.use(printData) //user printData function as middleware to print populated variables

app.listen(3001, () => console.log(`Server started on port 3001...`))

app.get("/login", (req, res) => {
    res.json({message: "Please login to continue"})

})
const jsonParser = express.json();

app.post ("/login", jsonParser,passport.authenticate('local', {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
}))

app.get("/dashboard", (req, res) => {
    res.json({message: "logged in successfully"})
})
