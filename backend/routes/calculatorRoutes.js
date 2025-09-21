const express = require('express');
const router = express.Router();
const Calculator = require('../models/Calculator');

// POST request to save a calculation
router.post('/', async (req, res) => {
    try {
        const { result, expression } = req.body;
        const newCalculation = new Calculator({
            result,
            expression,
        });

        const savedCalculation = await newCalculation.save();
        res.status(201).json(savedCalculation);
    } catch (error) {
        res.status(400).json({ message: 'Error saving calculation', error });
    }
});

// GET request to retrieve all calculations
router.get('/', async (req, res) => {
    try {
        const calculations = await Calculator.find().sort({}, { createdAt: -1 });
        res.status(200).json(calculations);
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving calculations', error });
    }
});

module.exports = router;