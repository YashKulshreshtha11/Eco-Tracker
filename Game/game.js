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

// Drag and Drop Logic for Desktop
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
      correctDrops.add(wasteType);

      if (score >= scoreLimit) {
        endGame('Congratulations! You reached the maximum score!', 'green');
      }
    } else {
      message.textContent = 'Incorrect! Try again.';
      message.style.color = 'red';
    }
  });
});

// Touch Events for Mobile
function handleTouchStart(e) {
  const waste = e.target.closest('.waste');
  if (!waste) return;
  e.preventDefault();

  const wasteType = waste.getAttribute('data-type');
  if (correctDrops.has(wasteType)) {
    message.textContent = 'This item is already sorted!';
    message.style.color = 'orange';
    return;
  }

  waste.setAttribute('data-touch-start', 'true');
  waste.style.position = 'absolute';
  waste.style.zIndex = 1000;

  const touch = e.touches[0];
  waste.style.left = `${touch.pageX - waste.offsetWidth / 2}px`;
  waste.style.top = `${touch.pageY - waste.offsetHeight / 2}px`;

  function handleTouchMove(e) {
    const touch = e.touches[0];
    waste.style.left = `${touch.pageX - waste.offsetWidth / 2}px`;
    waste.style.top = `${touch.pageY - waste.offsetHeight / 2}px`;
  }

  function handleTouchEnd(e) {
    const touch = e.changedTouches[0];

    dustbins.forEach((bin) => {
      const binRect = bin.getBoundingClientRect();
      const wasteRect = waste.getBoundingClientRect();

      if (
        wasteRect.left < binRect.right &&
        wasteRect.right > binRect.left &&
        wasteRect.top < binRect.bottom &&
        wasteRect.bottom > binRect.top
      ) {
        const binType = bin.getAttribute('data-type');
        if (wasteType === binType) {
          message.textContent = 'Correct! Keep it up!';
          message.style.color = 'green';
          score++;
          scoreElement.textContent = `Score: ${score}`;
          correctDrops.add(wasteType);
        } else {
          message.textContent = 'Incorrect! Try again.';
          message.style.color = 'red';
        }
      }
    });

    waste.style.position = '';
    waste.style.zIndex = '';
    waste.removeEventListener('touchmove', handleTouchMove);
    waste.removeEventListener('touchend', handleTouchEnd);
  }

  waste.addEventListener('touchmove', handleTouchMove);
  waste.addEventListener('touchend', handleTouchEnd);
}

wasteItems.forEach((waste) => {
  waste.addEventListener('touchstart', handleTouchStart);
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
  // Show the "Show Badge" button
  showBadgeButton.style.display = 'block';
});


restartButton.addEventListener('click', restartGame);

// Add logic for "Show Badge" functionality
const showBadgeButton = document.getElementById('show-badge-btn');

showBadgeButton.addEventListener('click', () => {
  if (score >= 6) {
    window.location.href = 'high_badge.html';
  } else if (score > 3 && score < 6) {
    window.location.href = 'avg_badge.html';
  } else {
    window.location.href = 'low_badge.html';
  }
});

// End Game Logic
function endGame(finalMessage, color) {
  message.textContent = finalMessage;
  message.style.color = color;

  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;

  wasteItems.forEach((waste) => {
    waste.setAttribute('draggable', 'false');
  });

  showBadgeButton.style.display = 'block';
}

// Restart Game Logic
function restartGame() {
  timeLeft = 60;
  score = 0;
  correctDrops.clear();

  timerElement.textContent = `Time Left: ${timeLeft}s`;
  scoreElement.textContent = `Score: ${score}`;
  message.textContent = '';

  wasteItems.forEach((waste) => {
    waste.setAttribute('draggable', 'true');
  });

  showBadgeButton.style.display = 'none';

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame('Time Up! Final Score: ' + score, 'orange');
    }
  }, 1000);

  backgroundMusic.play();
}
