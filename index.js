const express = require('express')
const app = express()
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

app.use(express.urlencoded({extended: false}))

// Middleware to handle CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://next-auth-app-six-delta.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(cors({
    origin: "https://next-auth-app-six-delta.vercel.app",
    credentials: true, // Allow credentials (cookies) to be sent with requests

}))
//Middleware
app.use(session({
    proxy: true,
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        domain: ".vercel.app"
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

app.post('/cookie-test', (req, res) => {
    const options = {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: ".vercel.app"
    };

    // Set cookie using res.cookie()
    res.cookie('cookieTestOne', 'cookieTestOne', options);

    // Set cookie using Set-Cookie header with res.append()
    const cookie2 = `cookieTestTwo=cookieTestTwo; Max-Age=${options.maxAge}; HttpOnly=${true}; Secure=${options.secure}; SameSite=${options.sameSite}; Domain=${options.domain}`;
    res.append('Set-Cookie', cookie2);

    // Set cookie using Set-Cookie header with res.setHeader()
    const cookie3 = `cookieTestThree=cookieTestThree; Max-Age=${options.maxAge}; HttpOnly=${true}; Secure=${options.secure}; SameSite=${options.sameSite}; Domain=${options.domain}`;
    res.setHeader('Set-Cookie', cookie3);

    // Set cookie using both res.cookie() and Set-Cookie header
    res.cookie('cookieTestFour', 'cookieTestFour', options);
    const cookie5 = `cookieTestFive=cookieTestFive; Max-Age=${options.maxAge}; HttpOnly=${true}; Secure=${options.secure}; SameSite=${options.sameSite}; Domain=${options.domain}`;
    res.append('Set-Cookie', cookie5);

    // Set cookie using both res.cookie() and Set-Cookie header with res.setHeader()
    res.cookie('cookieTestSix', 'cookieTestSix', options);
    const cookie7 = `cookieTestSeven=cookieTestSeven; Max-Age=${options.maxAge}; HttpOnly=${true}; Secure=${options.secure}; SameSite=${options.sameSite}; Domain=${options.domain}`;
    res.setHeader('Set-Cookie', cookie7);

    res.json({ message: "Cookies set successfully" });
});

app.get("/dashboard", (req, res) => {
   console.log(res.headers)
    res.json({message: "logged in successfully"})
})
