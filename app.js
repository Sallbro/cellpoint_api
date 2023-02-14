const express = require('express');
const app = express();
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' });
const db = require("./db/conn");
const port = process.env.PORT || 5500;

const rout = app.use(require('./routers/routs'));

app.listen(port, () => {
    console.log(`connection succesful at port ${port}`);
});


