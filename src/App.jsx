import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Add Components
import Calculator from './components/Calculator.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Calculator</h1>
      <Calculator />
    </>
  )
}

export default App
