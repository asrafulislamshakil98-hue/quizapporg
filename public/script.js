let coins = localStorage.getItem('coins') ? parseInt(localStorage.getItem('coins')) : 0;
document.getElementById('coins').innerText = coins;

const categories = ["সাধারণ জ্ঞান", "বিজ্ঞান", "ইতিহাস", "ভূগোল", "খেলাধুলা", "গণিত", "ধর্ম", "সাহিত্য", "চলচ্চিত্র", "কম্পিউটার", "রাজনীতি", "দেশ-বিদেশ", "আবিষ্কার", "মহাকাশ", "প্রাণীজগৎ", "উদ্ভিদ", "স্বাস্থ্য", "সংস্কৃতি", "অর্থনীতি", "পরিবেশ"];

const catList = document.getElementById('category-list');
categories.forEach(cat => {
    let btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.innerText = cat;
    btn.onclick = () => loadQuestionList(cat);
    catList.appendChild(btn);
});

let currentQuestions = [];

// ১. ক্যাটাগরি ক্লিক করলে সব প্রশ্নের লিস্ট দেখাবে
async function loadQuestionList(cat) {
    try {
        const res = await fetch(`/api/questions/${cat}`);
        currentQuestions = await res.json();
        
        if(currentQuestions.length === 0) return alert("কোনো প্রশ্ন নেই!");

        document.getElementById('cat-title-text').innerText = cat;
        const listContainer = document.getElementById('question-serial-list');
        listContainer.innerHTML = '';

        // সিরিয়ালে প্রশ্ন সাজানো
        currentQuestions.forEach((q, index) => {
            let div = document.createElement('div');
            div.className = 'q-item';
            div.innerText = `${index + 1}. ${q.question}`;
            div.onclick = () => openQuizModal(index); // ক্লিক করলে পপআপ খুলবে
            listContainer.appendChild(div);
        });

        document.getElementById('category-screen').style.display = 'none';
        document.getElementById('list-screen').style.display = 'block';
    } catch (e) { alert("সার্ভার এরর!"); }
}

// ২. প্রশ্নের ওপর ক্লিক করলে ৪টি অপশনসহ পপআপ খুলবে
function openQuizModal(index) {
    const q = currentQuestions[index];
    document.getElementById('modal-q-text').innerText = q.question;
    const optBox = document.getElementById('options-box');
    optBox.innerHTML = '';
    document.getElementById('feedback').innerText = '';

    q.options.forEach((opt, i) => {
        let btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(i, q.correctAnswer, btn);
        optBox.appendChild(btn);
    });

    document.getElementById('quiz-modal').style.display = 'flex';
}

function checkAnswer(selected, correct, btn) {
    const btns = document.querySelectorAll('.opt-btn');
    btns.forEach(b => b.disabled = true); // বাটন লক

    if(selected === correct) {
        btn.classList.add('correct');
        document.getElementById('feedback').innerText = "✅ সঠিক! +১০ কয়েন";
        updateCoins(10);
    } else {
        btn.classList.add('wrong');
        btns[correct].classList.add('correct');
        document.getElementById('feedback').innerText = "❌ ভুল! -৫ কয়েন";
        updateCoins(-5);
    }
}

function updateCoins(val) {
    coins += val;
    if(coins < 0) coins = 0;
    localStorage.setItem('coins', coins);
    document.getElementById('coins').innerText = coins;
}

function showCategories() {
    document.getElementById('category-screen').style.display = 'block';
    document.getElementById('list-screen').style.display = 'none';
}

function closeQuiz() {
    document.getElementById('quiz-modal').style.display = 'none';
}