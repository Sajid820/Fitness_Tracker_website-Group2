const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const RegistrationModel = require("./models/User")
const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/User")

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await RegistrationModel.findOne({ email });
      if (user) {
        if (user.password === password) { 
          return res.json({ message: 'Login successful' });
        } else {
          return res.status(401).json({ error: 'Incorrect password' });
        }
      } else {
        return res.status(404).json({ error: 'Email not found' });
      }
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
    
app.post('/Registration', (req, res) => {
    RegistrationModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.listen(3001,() => {
    console.log("server is up!")
})