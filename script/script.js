const cards = [...document.querySelectorAll('.card')];
const status = document.getElementById('status');
const restartBtn = document.getElementById('restart');

const values = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨'];
const totalPairs = cards.length / 2;

let opened = [];
let matches = 0;
let moves = 0;
let locked = false;

const setMessage = text => status.textContent = text;
const updateStatus = () => setMessage(`Ходи: ${moves} · Знайдено пар: ${matches} / ${totalPairs}`);

const shuffle = arr => arr.sort(() => Math.random() - 0.5);

function reset() {
  const selectedEmojis = shuffle([...values]).slice(0, totalPairs);
  const deck = shuffle([...selectedEmojis, ...selectedEmojis]);

  cards.forEach((card, i) => {
    card.dataset.value = deck[i];
    card.textContent = '';
    card.className = 'card';
  });

  opened = [];
  matches = 0;
  moves = 0;
  locked = false;
  
  updateStatus();
  setMessage('Натисніть на будь-яку картку, щоб почати.');
}

function reveal(card) {
  card.classList.add('revealed');
  card.textContent = card.dataset.value;
}

function hide(card) {
  card.classList.remove('revealed');
  card.textContent = '';
}

function onCardClick(event) {
  if (locked) return;
  
  const card = event.currentTarget;
  if (card.classList.contains('matched') || opened.includes(card)) return;

  reveal(card);
  opened.push(card);

  if (opened.length === 2) {
    moves++;
    const [first, second] = opened;

    if (first.dataset.value === second.dataset.value) {
      first.classList.add('matched');
      second.classList.add('matched');
      matches++;
      opened = [];
      updateStatus();

      if (matches === totalPairs) {
        setMessage(`Вітаю! Знайдено всі пари за ${moves} ходів.`);
      }
    } else {
      locked = true;
      updateStatus();
      
      setTimeout(() => {
        hide(first);
        hide(second);
        opened = [];
        locked = false;
      }, 700);
    }
  }
}

cards.forEach(card => card.addEventListener('click', onCardClick));
restartBtn.addEventListener('click', reset);
reset();