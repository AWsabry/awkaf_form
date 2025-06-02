import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './HomePage/home';
import ThankYou from './ThankYouPage/ThankYou'; // You will create this next

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/thankyou" element={<ThankYou/>} />
    </Routes>
  </Router>
);

export default App;
