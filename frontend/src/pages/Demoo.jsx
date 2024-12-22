import React from 'react';

const Home = () => (
  <div className="container mt-5">
    <h1>Welcome to Fitness Tracker</h1>
    <p>Your fitness journey starts here!</p>
  </div>
);

export default Home;




// Registration Route
app.post("/Registration", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to MongoDB
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to register user" });
  }
});






app.post("/Registration", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Check if email or password already exists
    const existingUser = await User.findOne({ $or: [{ email }, { password }] });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: "User with this email already exists" });
      }

      if (await bcrypt.compare(password, existingUser.password)) {
        return res.status(400).json({ error: "User with this password already exists" });
      }
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword, name });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
