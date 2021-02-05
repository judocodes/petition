// Dependencies
const express = require('express');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const sessionCookie = require('cookie-session');
const csurf = require('csurf');

// Utilities
const { addCsrfToken, denyXFrames } = require('./utils/security');
const {
    updateLoggedInStatus,
    removeSignatureWhenLoggedOut,
    requireLoggedIn,
    requireSignature,
} = require('./utils/auth');

// Routes
const petitionRoute = require('./routes/petition');
const thanksRoute = require('./routes/thanks');
const signersRoute = require('./routes/signers');
const aboutRoute = require('./routes/about');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const landingRoute = require('./routes/landing');
const profileRoute = require('./routes/profile');

// Setup
const app = express();
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

/***** Server *****/

// Setup Middleware
app.use(cookieParser());
app.use(
    sessionCookie({
        secret: process.env.SECRET,
        maxAge: 1000 * 60 * 60 * 3,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SECURITY Middleware
app.use(csurf());
app.use(addCsrfToken);
app.use(denyXFrames);

// Handle Edge Cases
app.use(removeSignatureWhenLoggedOut);

// Set Logged In Status for Navbar Menu accordingly
app.use(updateLoggedInStatus);

// Static route
app.use(express.static('./static'));

// Public routes
app.use(aboutRoute);
app.use(loginRoute);
app.use(registerRoute);
app.use(landingRoute);

// Below routes only accessible with UserId
app.use(requireLoggedIn);

// Require Logged In Routes
app.use(petitionRoute);
app.use(profileRoute);

// Below routes only accessible with Signature
app.use(requireSignature);

// Require Signature Routes
app.use(thanksRoute);
app.use(signersRoute);

// w/ user Id, redirect to thanks page.
app.get('*', (req, res) => {
    res.redirect(302, '/thanks');
});

module.exports = app;
