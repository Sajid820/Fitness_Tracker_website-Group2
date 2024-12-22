import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../contexts/UserContext";

const Home = () => {
  const { user, setUser } = useUser();
  const [bmi, setBmi] = useState(null);
  const [bmr, setBmr] = useState(null);
  const [weightStatus, setWeightStatus] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculate BMI
  const calculateBmi = () => {
    const heightInMeters = user.height / 100;
    const calculatedBmi = (user.weight / (heightInMeters ** 2)).toFixed(1);
    setBmi(calculatedBmi);

    if (calculatedBmi < 18.5) {
      setWeightStatus("Underweight");
    } else if (calculatedBmi >= 18.5 && calculatedBmi <= 24.9) {
      setWeightStatus("Normal weight");
    } else if (calculatedBmi >= 25 && calculatedBmi <= 29.9) {
      setWeightStatus("Overweight");
    } else {
      setWeightStatus("Obesity");
    }
  };

  // Calculate BMR
  const calculateBmr = () => {
    let calculatedBmr = 0;
    if (user.gender === "Male") {
      calculatedBmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
    } else {
      calculatedBmr = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
    }
    setBmr(calculatedBmr.toFixed(1));
  };

  // Save Health Data
  const saveHealthData = async (user, height, weight, age, bmi, bmr) => {
    if (!user?.email) {
      console.error("User email is not available. Please log in.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:3001/updateHealthData", {
        email: user.email,
        height,
        weight,
        age,
        bmi,
        bmr,
      });
  
      console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error saving health data:", error.response?.data || error.message);
    }
  };
  

  return (
    <div className="container mt-5">
      <h1>Welcome, {user.username}!</h1>
      <p>Enter your data below to calculate your BMI and BMR.</p>

      <form className="mb-4">
        <div className="mb-3">
          <label htmlFor="weight" className="form-label">Weight (kg):</label>
          <input
            type="number"
            className="form-control"
            id="weight"
            name="weight"
            value={user.weight}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="height" className="form-label">Height (cm):</label>
          <input
            type="number"
            className="form-control"
            id="height"
            name="height"
            value={user.height}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="age" className="form-label">Age:</label>
          <input
            type="number"
            className="form-control"
            id="age"
            name="age"
            value={user.age}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="gender" className="form-label">Gender:</label>
          <select
            className="form-select"
            id="gender"
            name="gender"
            value={user.gender}
            onChange={handleChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </form>

      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={calculateBmi}>
          Calculate BMI
        </button>
        <button className="btn btn-secondary me-2" onClick={calculateBmr}>
          Calculate BMR
        </button>
        <button
          className="btn btn-success"
          onClick={() => saveHealthData(user, user.height, user.weight, user.age, bmi, bmr)}
        >
          Save Data
        </button>
      </div>

      {bmi && (
        <div className="alert alert-info">
          <strong>BMI:</strong> {bmi} ({weightStatus})
        </div>
      )}

      {bmr && (
        <div className="alert alert-info">
          <strong>BMR:</strong> {bmr} kcal/day
        </div>
      )}
    </div>
  );
};

export default Home;
