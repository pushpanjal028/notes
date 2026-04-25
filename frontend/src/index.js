import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from "@material-tailwind/react";
import Navbar from './components/Navbar';
import Header from './components/Header';
import { Footer } from './components/Footer';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider>
    <Navbar />
    <Header />
    <App />
    <Footer />
  </ThemeProvider>
);
