const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    category: String,
    question: String,
    options: [String],
    correctAnswer: Number
});

module.exports = mongoose.model('Question', QuestionSchema);