import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from "./contexts/UserContext"; 
import Navbar from './Navbar';
import Footer from './Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';


const App = () => (
  <UserProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Footer />
    </Router>
  </UserProvider>
);


export default App;