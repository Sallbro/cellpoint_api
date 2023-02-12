const express = require('express');
const rout = express.Router();
const Authentication = require("../Auth");
// logins schema
const Loginmens = require("../models/loginschema");
// product scheme 
const Products = require("../models/productshema");
const DB = process.env.DATABASE;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookiepersor = require('cookie-parser');
const { redirect } = require('express/lib/response');
rout.use(express.json());
rout.use(cookiepersor());
rout.use(express.urlencoded({ extended: true }));

//get 
rout.get("/",async(req,res)=>{
    res.send("succ get req");

});

//get products
rout.get("/products", async (req, res) => {
    console.log("data prd ");
    const data = await Products.find({});
    console.log("data ",data);
    res.send(data);

});

//delete user products
rout.delete("/order", async (req, res) => {
    try {
        const data = req.body._id;
        const reg = await Loginmens.find({ "_id": data }, { "addtocarts": 1 });
        console.log("reg ", reg);
        res.send(reg);
    }
    catch (e) {
        res.send(e);
    }
})

//get message
rout.get("/message", async (req, res) => {
    try {
        const data = req.body._id;
        const reg = await Loginmens.find({}, { "messages": 1 });
        console.log("reg ", reg);
        res.send(reg);
    }
    catch (e) {
        res.send(e);
    }
})
//get user message 
rout.get("/user/message", async (req, res) => {
    try {
        const data = req.body._id;
        const reg = await Loginmens.find({ "_id": data }, { "messages": 1 });
        console.log("reg ", reg);
        res.send(reg);
    }
    catch (e) {
        res.send(e);
    }
})

//post login user
rout.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const names = await Loginmens.findOne({ email });
        console.log("coming to login names ", names);
        // console.log("names.tokens: " + names.tokens);
        const comp = await bcrypt.compare(password, names.password);
        // res.render('/login');

        if (comp) {

            const token = await names.getlogintoken();
            res.cookie("salman", token, {
                expires: new Date(Date.now() + 1000000000)
            });
            res.send(names);
            const lentoken = names.tokens.length;
            console.log("lentoken", lentoken);
            if (lentoken > 3) {
                try {
                    let deleteitem = names.tokens[0]._id;
                    console.log("deleteitem", deleteitem);
                    console.log("del 1");
                    const dellogin = await Loginmens.updateOne({ names }, {
                        $pull: {
                            tokens: { _id: deleteitem }
                        }
                    }, { multi: true });
                    console.log("del 2");
                    console.log("del 3");
                }
                catch (e) {
                    res.send("login delete error").status(400);
                    console("login delete error ", e);
                }
            }


        }
        else {
            res.status(400).send(Error);
        }

    }
    catch (e) {
        res.status(400).send("error is: " + e);
    }
});


//get login user
rout.get("/login", (req, res) => {
    res.render("login");
});

//post registration user
rout.post("/registration", async (req, res) => {
    const regisdata = req.body;
    const username = req.body.username;
    const phoneno = req.body.phoneno;
    const email = req.body.email;
    const password = req.body.password;


    console.log("regisdata ", regisdata);
    if (!username || !email || !password) {
        alert("Please Fill All The Details");
        return res.status(422).send("something went wrong registration");
    }
    try {
        const reg = new Loginmens({
            username,
            phoneno,
            email,
            password

        });
        console.log("reg: " + reg);
        const savereg = await reg.save();
        console.log("reg2: " + reg);
        res.send(savereg);
    }
    catch (e) {
        res.status(422).send("something went wrong " + e);
    }
});
//get registration user
rout.get("/registration", async (req, res) => {
    res.render('registration');
});


//get about
rout.get("/about", Authentication, async (req, res) => {
    res.send(req.rootusers);
});


//get addtocart
rout.get("/addtocart", Authentication, async (req, res) => {
    res.send(req.rootusers);
});

rout.get("/payment", Authentication, async (req, res) => {
    res.send(req.rootusers);
});

//add particular product
rout.post("/add", Authentication, async (req, res) => {
    try {
        const { productidx } = req.body;
        console.log("productidx ", productidx);
        const cartuser = await Loginmens.updateOne({ _id: req.rootusers_id }, {
            $push: { addtocarts: productidx }
        });
        if (cartuser) {
            // const addcartfun = await cartuser.addtocart(productidx);
            await cartuser.save();
            res.status(201).send(cartuser);
        }

    }
    catch (e) {
        // res.status(400).send("addtocart error back ", e);
    }
})

rout.post("/payment", Authentication, async (req, res) => {
    try {
        if (res.status !== 400) {
            const { address } = req.body;
            console.log("payment data rec succ ", address);
            const cartuser = await Loginmens.findOne({ _id: req.rootusers_id });
            if (cartuser) {
                const address_fun = await cartuser.address(address);
                await cartuser.save();
                res.status(201).send(cartuser);
                console.log("payment data sent succ ");
            }
        }
    }
    catch (e) {
        // res.status(400).send("addtocart error back ", e);
    }
})

//add all product
rout.post("/addall", Authentication, async (req, res) => {
    try {
        if (res.status !== 400) {
            const { usercarts } = req.body;
            console.log("addshopall ", usercarts);
            const cartuser = await Loginmens.findOne({ _id: req.rootusers_id });
            if (cartuser) {
                const addcartfun = await cartuser.addtocartall(usercarts);
                await cartuser.save();
                res.status(201).send(cartuser);
            }
        }
    }
    catch (e) {
        // res.status(400).send("addtocart error back ", e);
    }
})


//contact page
rout.post("/contact", Authentication, async (req, res) => {
    try {

        const { username, email, message, phoneno } = req.body;
        const contactuser = await Loginmens.findOne({ _id: req.rootusers_id });
        console.log("contactuser: ", contactuser);
        console.log("message: ", message);
        if (contactuser) {
            console.log("contactuser 2: ");
            const kyahowa = await contactuser.adddata(username, email, message, phoneno);
            console.log("kyahowa: ");
            await contactuser.save();
            res.status(201).send(contactuser);
        }
    }
    catch (e) {
        res.send("error");
    }

});


//get data
rout.get("/getdata", Authentication, async (req, res) => {
    res.send(req.rootusers);
});


//logout user
rout.get("/logout", Authentication, async (req, res) => {
    try {
        req.rootusers.tokens = req.rootusers.tokens.filter((elem) => {
            console.log("elem :", elem)
            if (elem !== null) {
                console.log("elem token: ", elem.token);
                return elem.token !== req.token;
            }
        })
        res.clearCookie("salman");
        await req.rootusers.save();
        res.send(req.token);
    }
    catch (e) {
        console.log("not gen token: ", e);
    }
});

module.exports = rout;

