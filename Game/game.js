const wasteItems = document.querySelectorAll('.waste');
const dustbins = document.querySelectorAll('.dustbin');
const message = document.getElementById('message');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const submitButton = document.getElementById('submit-btn');
const restartButton = document.getElementById('restart-btn'); // Added restart button
const backgroundMusic = document.getElementById('background-music');

let timeLeft = 60;
let score = 0;
const scoreLimit = 6;
const correctDrops = new Set(); // Track already dropped waste items

// Drag and Drop Logic
wasteItems.forEach((waste) => {
  waste.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', waste.getAttribute('data-type'));
  });
});

dustbins.forEach((bin) => {
  bin.addEventListener('dragover', (e) => {
    e.preventDefault(); // Allow drop
  });

  bin.addEventListener('drop', (e) => {
    e.preventDefault();
    const wasteType = e.dataTransfer.getData('text/plain');
    const binType = bin.getAttribute('data-type');

    // Check if this waste item is already correctly dropped
    if (correctDrops.has(wasteType)) {
      message.textContent = 'This item is already sorted!';
      message.style.color = 'orange';
      return;
    }

    if (wasteType === binType) {
      message.textContent = 'Correct! Keep it up!';
      message.style.color = 'green';
      score++;
      scoreElement.textContent = `Score: ${score}`;
      correctDrops.add(wasteType); // Mark this waste as correctly dropped

      // Check if score limit is reached
      if (score >= scoreLimit) {
        endGame('Congratulations! You reached the maximum score!', 'green');
      }
    } else {
      message.textContent = 'Incorrect! Try again.';
      message.style.color = 'red';
    }
  });
});

// Timer Logic
let timerInterval = setInterval(() => {
  timeLeft--;
  timerElement.textContent = `Time Left: ${timeLeft}s`;

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    endGame('Time Up! Final Score: ' + score, 'orange');
  }
}, 1000);

submitButton.addEventListener('click', () => {
  clearInterval(timerInterval);
  endGame(`You submitted! Final Score: ${score}`, 'blue');
});

restartButton.addEventListener('click', restartGame); // Restart game logic

// End Game Logic
function endGame(finalMessage, color) {
  message.textContent = finalMessage;
  message.style.color = color;
  
  // Stop music
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;

  // Disable drag and drop
  wasteItems.forEach((waste) => {
    waste.setAttribute('draggable', 'false');
  });
}

// Restart Game Logic
function restartGame() {
  // Reset variables
  timeLeft = 60;
  score = 0;
  correctDrops.clear();

  // Reset UI
  timerElement.textContent = `Time Left: ${timeLeft}s`;
  scoreElement.textContent = `Score: ${score}`;
  message.textContent = '';

  // Enable drag and drop
  wasteItems.forEach((waste) => {
    waste.setAttribute('draggable', 'true');
  });

  // Restart timer
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame('Time Up! Final Score: ' + score, 'orange');
    }
  }, 1000);

  // Restart music
  backgroundMusic.play();
}
