const mongoose = require('mongoose')

const RegistrationSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }, 
    weight: { type: Number },
    height: { type: Number },
    age: { type: Number },
    bmi: { type: Number },
    bmr: { type: Number },
  });

const RegistrationModel = mongoose.model("User", RegistrationSchema)
module.exports = RegistrationModel



