const bcrypt = require('bcryptjs/dist/bcrypt');
const mongoose = require('mongoose');
const res = require('express/lib/response');

const productschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    img: {
        type: String,
        required: true,
        trim: true
    },
    describtion: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    item: {
        type: Number,
        required: true,
        trim: true
    },
    discount: {
        type: Number,
        required: true,
        trim: true
    },
    image_details: []
});


const Productschema = new mongoose.model("products", productschema);
module.exports = Productschema;