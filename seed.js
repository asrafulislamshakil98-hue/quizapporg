const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Question = require('./models/Question');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    const data = JSON.parse(fs.readFileSync('./questions.json', 'utf-8'));
    await Question.deleteMany();
    await Question.insertMany(data);
    console.log("✅ ডাটাবেসে প্রশ্ন সেভ হয়েছে!");
    process.exit();
});