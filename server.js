const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const Question = require('./models/Question');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ১. আপনার লোগো এবং ডিজাইন ফাইলগুলো কানেক্ট করা
app.use(express.static(path.join(__dirname, 'public')));

// ২. MongoDB কানেকশন
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.log("❌ DB Error:", err));

// ৩. কুইজ প্রশ্নের এপিআই (API)
app.get('/api/questions/:category', async (req, res) => {
    try {
        const questions = await Question.find({ category: req.params.category }).limit(200);
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

// ৪. হোম রুট (এরর ফিক্সড): এখানে আর কোনো '*' নেই
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ৫. এরর ফিক্স: যদি কেউ অন্য কোনো ভুল লিঙ্কে যায়, তবুও ইনডেক্স ফাইল দেখাবে
app.get('/:path*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server is running: http://localhost:${PORT}`);
});