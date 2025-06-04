import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './HomePage/home';
import ThankYou from './ThankYouPage/ThankYou'; // You will create this next
import Dashboard from './dashboard/Dashboard';
import Login from './dashboard/Login';
import ProtectedRoute from './dashboard/ProtectedRoute';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/thankyou" element={<ThankYou/>} />
      <Route path="/login" element={<Login/>} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        } 
      />
    </Routes>
  </Router>
);

export default App;
