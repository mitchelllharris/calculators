const express = require('express');
const router = express.Router();
const Calculator = require('../models/Calculator');
const { evaluate } = require('mathjs');

// --- Save a calculation ---
router.post('/', async (req, res) => {
    try {
        const { result, expression } = req.body;
        const newCalculation = new Calculator({ result, expression });
        const savedCalculation = await newCalculation.save();
        res.status(201).json(savedCalculation);
    } catch (error) {
        res.status(400).json({ message: 'Error saving calculation', error });
    }
});

// --- Evaluate an expression ---
router.post('/evaluate', (req, res) => {
    const { expression } = req.body;
    try {
        const result = evaluate(expression);
        res.json({ result });
    } catch (error) {
        res.status(400).json({ message: 'Error evaluating expression', error: error.toString() });
    }
});

// --- Get all calculations ---
router.get('/', async (req, res) => {
    try {
        const calculations = await Calculator.find().sort({ createdAt: -1 });
        res.status(200).json(calculations);
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving calculations', error });
    }
});

module.exports = router;