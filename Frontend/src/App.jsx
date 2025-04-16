import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginFinal from '../componets/Login';
import RegisterFinal from '../componets/Register';
import Home from "../componets/Home"
import LogoutPage from '../componets/LogoutPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<LoginFinal/>} />
      <Route path="/register" element={
        <RegisterFinal/>} />
         <Route path="/logout" element={
        <LogoutPage/>} />
    </Routes>
  );
}

export default App;


