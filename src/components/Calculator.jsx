import React, { useState } from 'react';
import axios from 'axios';

const buttons = [
    '±', '%', '√', '⌫',
    '7', '8', '9', '÷',
    '4', '5', '6', '×',
    '1', '2', '3', '−',
    '0', '.', '=', '+',
    '(', ')', '^', 'C'
];

const symbolMap = {
    '÷': '/',
    '×': '*',
    '−': '-',
    '√': 'sqrt(',
    '%': '/100',
};

const Calculator = () => {
    const [expression, setExpression] = useState('');
    const [result, setResult] = useState('');
    const [message, setMessage] = useState('');

    const handleButtonClick = (btn) => {
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
        } else if (btn in symbolMap) {
            setExpression(expression + symbolMap[btn]);
        } else {
            setExpression(expression + btn);
        }
    };

    const evaluateExpression = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/calculator/evaluate', { expression });
            setResult(response.data.result);
            setMessage('Expression evaluated successfully!');
        } catch (error) {
            console.log('Error evaluating expression: ' + error.message);
            setMessage('Error evaluating expression. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
                <h1 className="text-2xl font-bold mb-4 text-center">Expression Calculator</h1>
                <input
                    type="text"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    placeholder="Enter expression"
                    className="w-full mb-3 px-3 py-2 border rounded text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="grid grid-cols-4 gap-2 mb-3">
                    {buttons.map((btn) => (
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
                <div className="bg-gray-50 rounded p-2 min-h-[2.5rem] mb-2 text-center text-xl font-semibold">
                    {result && <span>Result: {result}</span>}
                </div>
                {message && <div className="text-sm text-gray-500 text-center">{message}</div>}
            </div>
        </div>
    );
};

export default Calculator;