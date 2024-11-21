import React from 'react'
import Home from './pages/home/home'
import Login from './pages/login/Login'
import SignUp from './pages/signup/SignUp'
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const routes = (
  <Router>
    <Routes>``
      <Route path="/dashboard" exact element={<Home />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/signup" exact element={<SignUp />} /> 
      </Routes>
      </Router>
);

 const App = () => {
  return (
    <div>
      {routes}
    </div>
  )
}

export default App
