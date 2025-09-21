const mongoose = require('mongoose');

const calculatorSchema = new mongoose.Schema(
    {
        result: {
            type: String,
            required: true,
        },
        expression: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Calculator', calculatorSchema);