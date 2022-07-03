const express = require('express');
const app = express();
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' });
const db = require("../src/db/conn");
const port = process.env.PORT || 5000;

const rout = app.use(require('./routers/routs'));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Methods', 'Content-Type', 'Authorization');
    next();
})
app.listen(port, () => {
    console.log(`connection succesful at port ${port}`);
});


