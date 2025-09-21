import React, { useState } from 'react';
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
                <h1 className="text-4xl font-semibold mb-8 text-center text-gray-900 tracking-tight font-sans">
                    Calculator
                </h1>
                <input
                    type="text"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') evaluateExpression();
                    }}
                    placeholder="Type or use buttons…"
                    className="w-full mb-6 px-5 py-4 border border-gray-300 rounded-2xl text-2xl font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                />
                <div className="flex flex-col gap-1 mb-8">
                    {BUTTON_ROWS.map((row, i) => (
                        <div
                            key={i}
                            className={`grid gap-3 ${row.length === 1 ? 'grid-cols-1' : 'grid-cols-4'}`}
                        >
                            {row.map((btn) => (
                                <CalcButton key={btn} label={btn} onClick={handleButtonClick} />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 min-h-[2.5rem] mb-2 text-center text-3xl font-bold text-blue-700 border border-gray-200 shadow-sm">
                    {result && <span>{result}</span>}
                </div>
                {message && <div className="text-base text-red-400 text-center font-medium">{message}</div>}
            </div>
        </div>
    );
}

export default Calculator;