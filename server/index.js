const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./src/models/db/connector');
const { errorHandler } = require('./src/middlewares/errorHandler');
// body-parser no longer needed in newer versions of express -aaron
// const bodyParser = require ('body-parser');
const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');
const { auth } = require('express-oauth2-jwt-bearer');

// environment variables in .env file
require('dotenv').config();

// connects to ATLAS_URI 
connectDB();

// create express server
const app = express();

// port that server will run on
const port = process.env.PORT || 5000;

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-6ir-6qcd.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://test-api/',
  issuer: 'https://dev-6ir-6qcd.us.auth0.com/',
  algorithms: ['RS256']
});

// middleware
app.use(cors());
app.use(express.json());
app.use(jwtCheck);

const horseRouter = require('./src/routes/horse');
const lessonRouter = require('./src/routes/lesson');
const userRouter = require('./src/routes/user');

app.use('/horses', horseRouter);
app.use('/lessons', lessonRouter);
app.use('/users', userRouter);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});