import React from 'react';
import './App.css';
import Calculator from './components/Calculator.jsx';

// --- Main App Component ---
function App() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center">Calculator</h1>
      <Calculator />
      <div className="bg-red-500 p-8 text-white">Test Tailwind</div>
    </>
  );
}

export default App;
