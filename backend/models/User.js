const mongoose = require('mongoose')

const RegistrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
})

const RegistrationModel = mongoose.model("Users", RegistrationSchema)
module.exports = RegistrationModel