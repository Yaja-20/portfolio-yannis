// === GESTION DU SON ===
const audio = document.getElementById('bg-audio');
const toggleBtn = document.getElementById('toggle-sound');
let hasStarted = false;

toggleBtn.addEventListener('click', () => {
  if (!hasStarted) {
    audio.play();
    hasStarted = true;
  }

  audio.muted = !audio.muted;
  toggleBtn.textContent = audio.muted ? '🔇' : '🔊';
});

// === ANIMATION DES PARAGRAPHES D’INTRO ===
const introLines = document.querySelectorAll('.intro-line');

introLines.forEach((line, index) => {
  setTimeout(() => {
    line.style.opacity = '1';
    line.style.transform = 'translateY(0)';
  }, index * 1200);
});

// === Apparition du bouton "Commencer l'enquête" ===
const startButton = document.querySelector('.btn');

setTimeout(() => {
  startButton.style.opacity = '1';
  startButton.style.transform = 'translateY(0)';
}, introLines.length * 1200 + 500); // ajusté après les paragraphes
