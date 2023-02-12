const mongoose = require('mongoose');
const DB = process.env.DATABASE;

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("succesful");
}).catch((err) => {
    console.log(`failed connection ${err}`)
});
