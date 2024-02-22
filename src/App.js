import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Home from './components/home';
import Navbar from './components/navbar';
import './App.css';

function App() {
  return (
    <div className="main-cont">
      <Router>
        <div className="navbar">
          <Navbar />
        </div>
        <div className="home">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
