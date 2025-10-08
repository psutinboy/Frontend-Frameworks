const { default: mongoose } = require("mongoose");

const userSchhema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: false },
    email: { type: String, required: true },
    address: { type: String, required: false },
    mobile: { type: Number, required: true }
})

module.exports = mongoose.model('User', userSchhema);