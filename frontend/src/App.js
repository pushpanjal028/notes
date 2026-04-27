import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateNote from './pages/CreateNote';
import Auth from './pages/Auth';
import Footer from './components/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateNote />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>

      <Footer />

    </div>
  )
}

export default App