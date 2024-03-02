const express = require('express')
const app = express()
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const cookieParser = require('cookie-parser');

app.use(express.urlencoded({extended: false}))

// Middleware to handle CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://next-auth-app-six-delta.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
/*app.use(cors({
    origin: "https://next-auth-app-six-delta.vercel.app",
    credentials: true, // Allow credentials (cookies) to be sent with requests

}))*/
//Middleware
app.use(cookieParser());
app.use(session({
    secret: 'your-secret-key', // Change this to a long, randomly generated string
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        sameSite: 'none'
    }
}));
app.set('view engine','ejs');
app.engine('ejs', require('ejs').__express);



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

// Possible values for each key
const maxAgeValues = [1000 * 60 * 60 * 24 * 7, 1000 * 60 * 60 * 24 * 14];
const httpOnlyValues = [true, false];
const secureValues = [true, false];
const sameSiteValues = ['none', 'strict', 'lax'];
const domainValues = [];

// Array to store all possible options combinations
const optionsArray = [];

// Generate all possible combinations
maxAgeValues.forEach(maxAge => {
    httpOnlyValues.forEach(httpOnly => {
        secureValues.forEach(secure => {
            sameSiteValues.forEach(sameSite => {

                    optionsArray.push({
                        maxAge,
                        httpOnly,
                        secure,

                        domain
                    });

            });
        });
    });
});

app.post('/cookie-alternative', (req, res) => {
    const responses = [];

    optionsArray.forEach((options, index) => {
        // Set cookie using res.cookie()
        res.cookie(`cookieTest${index + 1}`, `cookieTest${index + 1}`, options);
        responses.push(`CookieTest${index + 1} set successfully with options: ${JSON.stringify(options)}`);
    });

    res.json({ messages: responses });
});

app.get("/dashboard", (req, res) => {
   console.log(res.headers)
    res.json({message: "logged in successfully"})
})

app.use(passport.initialize()) // init passport on every route call
app.use(passport.session())    //allow passport to use "express-session"
app.use(express.json());
