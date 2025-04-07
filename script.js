// Effet "machine à écrire"
const typewriter = document.getElementById('typewriter');
const text = "Chaque ligne de code est un pas vers l’avenir";
let index = 0;

function typeEffect() {
  if (index < text.length) {
    typewriter.innerHTML = text.substring(0, index + 1);
    index++;
    setTimeout(typeEffect, 100);
  }
}

document.addEventListener("DOMContentLoaded", typeEffect);
console.log("Le fichier JavaScript est chargé !");

// Gestion du thème sombre/clair
const toggleButton = document.getElementById("theme-toggle");
toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Historique des calculs
function addToHistory(operation, result) {
  const history = document.getElementById("history");
  const entry = document.createElement("div");
  entry.textContent = `${operation} = ${result}`;
  history.prepend(entry);
}

// Calculatrice - Opérations scientifiques
function computeSquare() {
  if (currentOperand === "" || isNaN(parseFloat(currentOperand))) return; // Vérifie si l'entrée est valide
  const result = (parseFloat(currentOperand) ** 2).toString();
  addToHistory(`${currentOperand}²`, result); // Ajoute à l'historique
  currentOperand = result;
  updateDisplay(); // Met à jour l'affichage
}

function computeSquareRoot() {
  if (currentOperand === "" || isNaN(parseFloat(currentOperand))) return; // Vérifie si l'entrée est valide
  const result = Math.sqrt(parseFloat(currentOperand)).toString();
  addToHistory(`√${currentOperand}`, result); // Ajoute à l'historique
  currentOperand = result;
  updateDisplay(); // Met à jour l'affichage
}

// Calculatrice - Logique principale
let currentOperand = "";
let previousOperand = "";
let operation = null;

function appendNumber(number) {
  currentOperand += number;
  updateDisplay();
}

function chooseOperation(op) {
  if (currentOperand === "") return;
  if (previousOperand !== "") computeResult();
  operation = op;
  previousOperand = currentOperand;
  currentOperand = "";
}

function clearResult() {
  currentOperand = "";
  previousOperand = "";
  operation = null;
  updateDisplay();
}

function computeResult() {
  let computation;
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) return;

  switch (operation) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "*":
      computation = prev * curr;
      break;
    case "/":
      computation = prev / curr;
      break;
    default:
      return;
  }

  addToHistory(`${prev} ${operation} ${curr}`, computation);
  currentOperand = computation.toString();
  operation = null;
  previousOperand = "";
  updateDisplay();

  // Animation sur le résultat
  const resultInput = document.getElementById('result');
  resultInput.classList.add('animate-result');
  setTimeout(() => resultInput.classList.remove('animate-result'), 300);
}

function updateDisplay() {
  document.getElementById("result").value = currentOperand;
}

// Animation de la timeline
const events = document.querySelectorAll(".event");

window.addEventListener("scroll", () => {
  events.forEach(event => {
    const rect = event.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      event.classList.add("visible");
    }
  });
});

// Ajouter une classe pour l'animation au chargement
window.addEventListener("DOMContentLoaded", () => {
  const contactSection = document.querySelector(".contact-section");
  contactSection.classList.add("loaded");
});
function exportHistory() {
  const history = document.getElementById('history').innerText;
  const blob = new Blob([history], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'historique_calculs.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Affiche le toast uniquement après export
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Toast moderne
function handleSubmit(event) {
  event.preventDefault(); // Empêche le comportement normal
  const form = event.target;

  fetch(form.action, {
    method: "POST",
    body: new FormData(form),
    headers: {
      Accept: "application/json"
    }
  }).then(response => {
    if (response.ok) {
      window.location.href = "merci.html"; // Redirige après succès
    } else {
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  });

  return false; // Assure qu’aucune redirection native n’a lieu
}
