const jwt = require("jsonwebtoken");
const user = require("./models/loginschema");

const Authentication = async (req, res, next) => {
    try {
        const token = req.cookies.salman;
        const verifytoken = jwt.verify(token, "mynameissalmanandilovetocode");
        const rootusers = await user.findOne({ _id: verifytoken._id, "tokens.token": token })

        if (!rootusers) {
            res.send("salman error");
            // console.log("salman error");

        } else {
            // console.log("rootusers",rootusers);
            req.rootusers_id = rootusers._id;
            req.token=token;
            // console.log("token: ",token);
            // console.log("rootusers_tokens ",rootusers.tokens);
            // console.log("rootusers_id ",rootusers._id);
            req.rootusers = rootusers;

        }

    }
    catch (e) {
        res.status(400).send("auth error");
        // console.log("error found");
    }
    next();
}

module.exports = Authentication;