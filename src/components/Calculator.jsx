import React, { useState, useRef } from 'react';
import axios from 'axios';

// --- Button Layout and Symbol Mapping ---
const BUTTON_ROWS = [
    ['±', '%', '√', '⌫'],
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '−'],
    ['0', '.', '=', '+'],
    ['(', ')', '^', 'C'],
    ['π', '!', 'log', 'ln'],
    ['sin', 'cos', 'tan', 'abs'],
    ['e']
];

const SYMBOL_MAP = {
    '÷': '/',
    '×': '*',
    '−': '-',
    '√': 'sqrt(',
    '%': '/100',
    'π': 'pi',
    '!': '!',
    'log': 'log(',
    'ln': 'ln(',
    'sin': 'sin(',
    'cos': 'cos(',
    'tan': 'tan(',
    'abs': 'abs(',
    'e': 'e'
};

// --- Button Component ---
function CalcButton({ label, onClick }) {
    // Style mapping for special buttons
    const baseStyle = "py-3 rounded-2xl text-xl font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-400";
    const styleMap = {
        '=': "bg-blue-600 text-white hover:bg-blue-700 active:scale-95",
        'C': "bg-red-500 text-white hover:bg-red-600 active:scale-95",
        '⌫': "bg-yellow-400 text-white hover:bg-yellow-500 active:scale-95",
        'default': "bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-95"
    };
    const style = styleMap[label] || styleMap['default'];

    return (
        <button
            onClick={() => onClick(label)}
            className={`${baseStyle} ${style}`}
            style={{
                fontFamily: 'SF Pro Display, Helvetica Neue, Arial, sans-serif',
                letterSpacing: label.length > 1 ? '0.02em' : 'normal'
            }}
        >
            {label}
        </button>
    );
}

// --- Main Calculator Component ---
function Calculator() {
    const [expression, setExpression] = useState('');
    const [result, setResult] = useState('');
    const [message, setMessage] = useState('');
    const inputRef = useRef(null);

    // Handle button clicks
    function handleButtonClick(btn) {
        if (btn === 'C') {
            setExpression('');
            setResult('');
            setMessage('');
        } else if (btn === '⌫') {
            setExpression(expression.slice(0, -1));
        } else if (btn === '=') {
            evaluateExpression();
        } else if (btn === '±') {
            if (expression && !isNaN(expression)) {
                setExpression(String(-Number(expression)));
            }
        } else if (btn in SYMBOL_MAP) {
            setExpression(expression + SYMBOL_MAP[btn]);
        } else {
            setExpression(expression + btn);
        }
        // Focus input for keyboard after button click
        if (inputRef.current) inputRef.current.focus();
    }

    // Evaluate the current expression
    async function evaluateExpression() {
        try {
            const response = await axios.post('http://localhost:5000/api/calculator/evaluate', { expression });
            setResult(response.data.result);
            setMessage('');
        } catch (error) {
            setMessage('Error evaluating expression. Please try again.');
        }
    }

    // --- Render ---
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xs">
                <h1 className="text-2xl font-bold mb-4 text-center">Calculator</h1>
                {/* Calculator screen */}
                <div
                    className="bg-gray-900 rounded-xl mb-6 px-4 py-6 flex flex-col items-end shadow-inner cursor-text"
                    onClick={() => inputRef.current && inputRef.current.focus()}
                >
                    {/* Hidden input for keyboard entry */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={expression}
                        onChange={e => setExpression(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') evaluateExpression();
                        }}
                        className="absolute opacity-0 pointer-events-none"
                        tabIndex={-1}
                        autoFocus={false}
                    />
                    {/* Expression display */}
                    <div className="text-right w-full text-2xl text-gray-200 font-mono break-words min-h-[2.5rem] select-none">
                        {expression || <span className="text-gray-500">0</span>}
                    </div>
                    {/* Result display */}
                    {result && (
                        <div className="text-right w-full text-4xl text-blue-400 font-bold mt-2 break-words min-h-[2.5rem] select-none">
                            {result}
                        </div>
                    )}
                </div>
                {/* Buttons */}
                <div className="flex flex-col gap-2 mb-3">
                    {BUTTON_ROWS.map((row, i) => (
                        <div key={i} className="grid grid-cols-4 gap-2">
                            {row.map((btn) => (
                                <button
                                    key={btn}
                                    onClick={() => handleButtonClick(btn)}
                                    className={`py-2 rounded text-lg font-medium shadow 
                  ${btn === '=' ? 'bg-blue-500 text-white' : 
                    btn === 'C' ? 'bg-red-500 text-white' : 
                    btn === '⌫' ? 'bg-yellow-400 text-white' : 
                    'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                `}
                                >
                                    {btn}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
                {message && <div className="text-sm text-gray-500 text-center">{message}</div>}
            </div>
        </div>
    );
}

export default Calculator;