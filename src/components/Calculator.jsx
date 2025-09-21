import { useState } from 'react';
import axios from 'axios';

const Calculator = () => {
    const [expression, setExpression] = useState('');
    const [result, setResult] = useState('');
    const [message, setMessage] = useState('');

    // Evaluate the expression using a backend service
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
        <div className="calculator">
            <h1>Calculator</h1>
            <input type="text" value={expression} onChange={(e) => setExpression(e.target.value)} placeholder="Enter expression" />
            <button onClick={evaluateExpression}>Calculate</button>
            <div className="result">
                {result && <p>Result: {result}</p>}
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default Calculator;